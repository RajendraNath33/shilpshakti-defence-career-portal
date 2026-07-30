import { useEffect, useMemo, useState } from 'react';
import { useLang } from '../i18n';
import Reveal from './Reveal';
import { IconCheck, IconRupee, IconStar, IconShield, IconArrowRight, IconFile, IconClock, IconX, IconRadar } from './icons';

interface StoredRequest {
  ref: string;
  name: string;
  phone: string;
  services: string[];
  total: number;
  date: string;
  slot: string;
  createdAt: number;
}

const STORE_KEY = 'ss-csc-requests';

const readStore = (): StoredRequest[] => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as StoredRequest[]) : [];
  } catch {
    return [];
  }
};

const writeStore = (list: StoredRequest[]) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
};

/* Progress advances one stage every 12 hours after filing (demo model). */
const stageFor = (createdAt: number): number => {
  const hours = (Date.now() - createdAt) / 36e5;
  return Math.max(0, Math.min(3, Math.floor(hours / 12)));
};

const todayIso = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/* Assisted CSC Govt. Services — service selection, Kendra appointment booking
   and reference-number status tracking. */
export default function CSCForm() {
  const { t } = useLang();
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptSlot, setApptSlot] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<StoredRequest | null>(null);

  const [trackOpen, setTrackOpen] = useState(false);
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<StoredRequest | null>(null);
  const [trackError, setTrackError] = useState('');

  const total = useMemo(
    () => t.csc.services.filter((s) => selected.includes(s.id)).reduce((sum, s) => sum + s.price, 0),
    [selected, t]
  );

  /* Close the tracking modal on Escape. */
  useEffect(() => {
    if (!trackOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTrackOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [trackOpen]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setError('');
  };

  const submit = () => {
    if (selected.length === 0) {
      setError(t.csc.selectOne);
      return;
    }
    if (!name.trim() || !/^\d{10}$/.test(phone.trim())) {
      setError(t.csc.fillDetails);
      return;
    }
    if (!apptDate || !apptSlot) {
      setError(t.csc.pickSlot);
      return;
    }
    setError('');
    setSubmitting(true);

    window.setTimeout(() => {
      const entry: StoredRequest = {
        ref: `SS-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        name: name.trim(),
        phone: phone.trim(),
        services: [...selected],
        total,
        date: apptDate,
        slot: apptSlot,
        createdAt: Date.now(),
      };
      writeStore([entry, ...readStore()].slice(0, 40));
      setReceipt(entry);
      setSubmitting(false);
    }, 700);
  };

  const reset = () => {
    setReceipt(null);
    setSelected([]);
    setName('');
    setPhone('');
    setApptDate('');
    setApptSlot('');
    setError('');
  };

  const runTrack = () => {
    const ref = trackInput.trim().toUpperCase();
    const found = readStore().find((r) => r.ref === ref);
    if (!found) {
      setTrackResult(null);
      setTrackError(t.csc.trackNotFound);
      return;
    }
    setTrackError('');
    setTrackResult(found);
  };

  const openTracker = (prefill?: string) => {
    setTrackInput(prefill ?? '');
    setTrackResult(null);
    setTrackError('');
    setTrackOpen(true);
  };

  const serviceNameById = (id: string) => t.csc.services.find((s) => s.id === id)?.name ?? id;

  return (
    <section id="csc" className="camo-light relative scroll-mt-24 text-ink-900">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-olive-600">
                <IconStar width={12} height={12} className="text-gold-600" />
                {t.csc.eyebrow}
              </p>
              <h2 className="mt-3 font-display font-bold uppercase text-camo-900 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
                {t.csc.heading}
              </h2>
              <p className="mt-4 text-olive-600 text-[15px] leading-relaxed">{t.csc.sub}</p>
            </div>
            <button
              type="button"
              onClick={() => openTracker()}
              className="shrink-0 inline-flex items-center gap-2.5 btn-stamp bg-camo-900 text-gold-300 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-3 rounded-sm"
            >
              <IconRadar width={16} height={16} />
              {t.csc.trackBtn}
            </button>
          </div>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
          {/* ---------- Service selection ---------- */}
          <Reveal delay={100}>
            <div className="camo-dark border-2 border-camo-900 rounded-sm p-6 sm:p-8 shadow-[8px_8px_0_rgba(58,75,50,0.55)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2.5 font-display font-semibold uppercase tracking-[0.14em] text-gold-300 text-sm">
                  <IconFile width={17} height={17} />
                  {t.csc.pickServices}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.16em] text-olive-300 border border-olive-500/50 px-2 py-1 rounded-sm">
                  <IconShield width={12} height={12} className="text-gold-400" />
                  CSC // HALDWANI
                </span>
              </div>

              <div className="mt-6 space-y-3.5">
                {t.csc.services.map((s) => {
                  const on = selected.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`flex items-start gap-4 border-2 rounded-sm p-4 cursor-pointer transition-all duration-200 ${
                        on ? 'border-gold-400 bg-gold-400/10 -translate-y-0.5' : 'border-olive-500/50 bg-camo-950/50 hover:border-olive-300'
                      }`}
                    >
                      <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="sr-only" />
                      <span
                        className={`mt-0.5 w-5 h-5 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors ${
                          on ? 'bg-gold-400 border-gold-400 text-camo-950' : 'border-olive-400 text-transparent'
                        }`}
                        aria-hidden="true"
                      >
                        <IconCheck width={13} height={13} strokeWidth={3} />
                      </span>
                      <span className="flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className={`font-display font-semibold uppercase tracking-[0.06em] text-[14px] ${on ? 'text-gold-300' : 'text-cream-100'}`}>
                            {s.name}
                          </span>
                          <span className="inline-flex items-center gap-1 shrink-0 font-mono text-[12px] font-bold text-gold-300 bg-camo-950 border border-gold-400/40 px-2 py-1 rounded-sm">
                            <IconRupee width={12} height={12} />
                            {s.price}
                          </span>
                        </span>
                        <span className="block mt-1.5 text-[12.5px] leading-relaxed text-cream-200/75">{s.desc}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 border-l-4 border-gold-400 bg-camo-950/70 px-4 py-3.5">
                <p className="text-[12px] leading-relaxed text-cream-200/85">{t.csc.chargeNote}</p>
              </div>
            </div>
          </Reveal>

          {/* ---------- Details, appointment & submit ---------- */}
          <Reveal delay={220}>
            <div className="border-2 border-gold-400/60 bg-cream-50 rounded-sm overflow-hidden shadow-[8px_8px_0_rgba(240,180,41,0.45)]">
              <div className="bg-camo-900 px-6 py-4 flex items-center justify-between">
                <h3 className="font-display font-semibold uppercase tracking-[0.14em] text-gold-300 text-sm">
                  {receipt ? t.csc.successTitle : t.csc.yourDetails}
                </h3>
                <span className="font-mono text-[9.5px] tracking-[0.18em] text-olive-300">DIVYA SEVA KENDRA</span>
              </div>

              {receipt ? (
                <div className="p-6 sm:p-8 text-center">
                  <span className="mx-auto w-16 h-16 rounded-full bg-olive-600 text-cream-100 flex items-center justify-center">
                    <IconCheck width={30} height={30} strokeWidth={2.6} />
                  </span>
                  <p className="mt-5 font-mono text-[11px] tracking-[0.2em] text-olive-600 uppercase">{t.csc.refLabel}</p>
                  <p className="mt-1.5 font-display font-bold text-3xl text-camo-900 tracking-[0.08em]">{receipt.ref}</p>
                  <p className="mt-3 text-[12px] text-olive-600 max-w-xs mx-auto">{t.csc.saveRef}</p>

                  <div className="mt-5 inline-flex flex-wrap justify-center items-center gap-x-3 gap-y-2 border border-dashed border-olive-500/50 bg-cream-200 px-4 py-2.5 rounded-sm">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-camo-800">
                      <IconClock width={13} height={13} className="text-olive-600" />
                      {receipt.date} • {receipt.slot}
                    </span>
                    <span className="font-mono font-bold text-camo-900">₹{receipt.total}</span>
                  </div>

                  <p className="mt-4 text-[13px] leading-relaxed text-olive-600 max-w-xs mx-auto">{t.csc.successNote}</p>

                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => openTracker(receipt.ref)}
                      className="inline-flex items-center justify-center gap-2 btn-stamp bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-3 rounded-sm"
                    >
                      <IconRadar width={15} height={15} />
                      {t.csc.trackBtn}
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 border-2 border-camo-900 text-camo-900 hover:bg-camo-900 hover:text-gold-300 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-3 rounded-sm transition-colors"
                    >
                      {t.csc.newRequest}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="csc-name" className="block text-[12.5px] font-semibold text-camo-800 mb-1.5">
                        {t.csc.name} <span className="text-brick-500">*</span>
                      </label>
                      <input
                        id="csc-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setError('');
                        }}
                        placeholder="Ramesh Singh Bisht"
                        className="w-full bg-cream-100 border border-olive-500/40 rounded-sm px-3.5 py-2.5 text-[14px] text-camo-900 placeholder:text-olive-400/70 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="csc-phone" className="block text-[12.5px] font-semibold text-camo-800 mb-1.5">
                        {t.csc.phone} <span className="text-brick-500">*</span>
                      </label>
                      <input
                        id="csc-phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          setError('');
                        }}
                        placeholder="9876543210"
                        className="w-full bg-cream-100 border border-olive-500/40 rounded-sm px-3.5 py-2.5 text-[14px] text-camo-900 placeholder:text-olive-400/70 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Appointment booking */}
                  <div className="mt-6 border-t-2 border-dashed border-olive-500/40 pt-5">
                    <h4 className="flex items-center gap-2 font-display font-semibold uppercase tracking-[0.14em] text-[12px] text-camo-800">
                      <IconClock width={15} height={15} className="text-gold-600" />
                      {t.csc.apptTitle}
                    </h4>
                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="csc-date" className="block text-[12.5px] font-semibold text-camo-800 mb-1.5">
                          {t.csc.apptDate} <span className="text-brick-500">*</span>
                        </label>
                        <input
                          id="csc-date"
                          type="date"
                          min={todayIso()}
                          value={apptDate}
                          onChange={(e) => {
                            setApptDate(e.target.value);
                            setError('');
                          }}
                          className="w-full bg-cream-100 border border-olive-500/40 rounded-sm px-3.5 py-2.5 text-[14px] text-camo-900 focus:outline-none focus:border-gold-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="csc-slot" className="block text-[12.5px] font-semibold text-camo-800 mb-1.5">
                          {t.csc.apptSlot} <span className="text-brick-500">*</span>
                        </label>
                        <select
                          id="csc-slot"
                          value={apptSlot}
                          onChange={(e) => {
                            setApptSlot(e.target.value);
                            setError('');
                          }}
                          className="w-full bg-cream-100 border border-olive-500/40 rounded-sm px-3.5 py-2.5 text-[14px] text-camo-900 focus:outline-none focus:border-gold-500 transition-colors"
                        >
                          <option value="">{t.csc.apptSlotPh}</option>
                          {t.csc.slots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className="mt-3 text-[11.5px] text-olive-600 leading-relaxed">{t.csc.apptNote}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-olive-500/40 pt-5">
                    <span className="font-display font-semibold uppercase tracking-[0.12em] text-[13px] text-camo-800">{t.csc.total}</span>
                    <span className="font-display font-bold text-3xl text-camo-900 tabular-nums">₹{total}</span>
                  </div>

                  {error && (
                    <p className="mt-4 border-l-4 border-brick-500 bg-brick-500/10 px-3.5 py-2.5 text-[12.5px] text-brick-500 font-medium">{error}</p>
                  )}

                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className={`mt-5 w-full inline-flex items-center justify-center gap-2.5 btn-stamp font-display font-semibold uppercase tracking-[0.1em] text-[13px] px-6 py-3.5 rounded-sm ${
                      submitting ? 'shimmer bg-gold-500 text-camo-950 cursor-wait' : 'bg-gold-400 text-camo-950'
                    }`}
                  >
                    {submitting ? t.csc.submitDone : t.csc.submit}
                    {!submitting && <IconArrowRight width={16} height={16} strokeWidth={2.2} />}
                  </button>

                  <p className="mt-4 text-center text-[11px] text-olive-600">{t.csc.managedBy}</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---------- Tracking modal ---------- */}
      {trackOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t.csc.trackTitle}
        >
          <button
            type="button"
            aria-label={t.csc.trackClose}
            onClick={() => setTrackOpen(false)}
            className="absolute inset-0 bg-camo-950/80 backdrop-blur-sm"
          />
          <div className="relative w-full sm:max-w-lg camo-dark border-2 border-gold-400/70 rounded-t-md sm:rounded-md shadow-[0_24px_70px_rgba(0,0,0,0.6)] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between bg-camo-950 border-b border-gold-400/40 px-5 py-4 sticky top-0">
              <h3 className="font-display font-semibold uppercase tracking-[0.14em] text-gold-300 text-sm">{t.csc.trackTitle}</h3>
              <button
                type="button"
                onClick={() => setTrackOpen(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-olive-500/60 text-cream-200 hover:text-gold-300 hover:border-gold-400 transition-colors"
                aria-label={t.csc.trackClose}
              >
                <IconX width={16} height={16} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-[13px] text-cream-200/80 leading-relaxed">{t.csc.trackSub}</p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runTrack();
                  }}
                  placeholder={t.csc.trackPh}
                  className="flex-1 bg-camo-950/70 border border-olive-500/50 rounded-sm px-3.5 py-2.5 text-[14px] font-mono tracking-widest text-cream-100 placeholder:text-olive-300/60 focus:outline-none focus:border-gold-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={runTrack}
                  className="inline-flex items-center justify-center gap-2 btn-stamp bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-2.5 rounded-sm"
                >
                  {t.csc.trackSubmit}
                </button>
              </div>

              {trackError && (
                <p className="mt-4 border-l-4 border-brick-500 bg-brick-500/10 px-3.5 py-2.5 text-[12.5px] text-brick-500 font-medium">{trackError}</p>
              )}

              {trackResult && (
                <div className="mt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border border-dashed border-gold-400/50 rounded-sm px-4 py-3">
                    <span className="font-display font-bold text-xl text-cream-50 tracking-[0.08em]">{trackResult.ref}</span>
                    <span className="font-mono text-[10.5px] text-olive-300">
                      {t.csc.trackFiledOn}: {new Date(trackResult.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-px bg-camo-700 border border-camo-700 rounded-sm overflow-hidden text-[12.5px]">
                    <div className="bg-camo-900 px-3.5 py-2.5">
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-olive-300">{t.csc.name}</dt>
                      <dd className="mt-0.5 text-cream-100">{trackResult.name}</dd>
                    </div>
                    <div className="bg-camo-900 px-3.5 py-2.5">
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-olive-300">{t.csc.trackAppt}</dt>
                      <dd className="mt-0.5 text-cream-100">
                        {trackResult.date} • {trackResult.slot}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.18em] text-olive-300">{t.csc.trackServicesLabel}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {trackResult.services.map((id) => (
                      <span key={id} className="text-[11.5px] font-medium bg-cream-100 text-camo-800 border border-cream-300 px-2.5 py-1.5 rounded-sm">
                        {serviceNameById(id)}
                      </span>
                    ))}
                    <span className="text-[11.5px] font-mono font-bold bg-gold-400 text-camo-950 px-2.5 py-1.5 rounded-sm">₹{trackResult.total}</span>
                  </div>

                  {/* Progress timeline */}
                  <ol className="mt-6 space-y-0">
                    {t.csc.statusSteps.map((label, i) => {
                      const current = stageFor(trackResult.createdAt);
                      const done = i < current;
                      const active = i === current;
                      return (
                        <li key={label} className="relative flex gap-4 pb-6 last:pb-0">
                          {i < t.csc.statusSteps.length - 1 && (
                            <span
                              className={`absolute left-[13px] top-7 bottom-0 w-0.5 ${done ? 'bg-gold-400' : 'bg-camo-700'}`}
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`relative z-10 w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center ${
                              done
                                ? 'bg-gold-400 border-gold-400 text-camo-950'
                                : active
                                  ? 'border-gold-400 text-gold-300 bg-camo-950'
                                  : 'border-camo-700 text-olive-400 bg-camo-950'
                            }`}
                          >
                            {done ? <IconCheck width={14} height={14} strokeWidth={3} /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                          </span>
                          <span className="pt-0.5">
                            <span className={`block font-display uppercase tracking-[0.1em] text-[12.5px] ${done || active ? 'text-cream-50' : 'text-olive-300/70'}`}>
                              {label}
                            </span>
                            {active && (
                              <span className="mt-1 inline-block font-mono text-[10px] tracking-[0.16em] text-gold-300 border border-gold-400/50 bg-gold-400/10 px-2 py-0.5 rounded-sm">
                                {t.csc.statusCurrent}
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
