import { useEffect, useMemo, useState } from 'react';
import { useLang } from '../i18n';
import { buildProfile } from '../lib/cvEngine';
import type { CorporateProfile, CvInput } from '../lib/cvEngine';
import { generateCvPdf } from '../lib/pdf';
import { FORCES, findForce } from '../data/forces';
import type { CvTemplate } from '../data/forces';
import Reveal from './Reveal';
import { IconSpark, IconDownload, IconFile, IconRadar, IconStar, IconShield, IconCheck } from './icons';

const EMPTY: CvInput = {
  name: '',
  phone: '',
  forceId: '',
  rankId: '',
  tradeId: '',
  years: '',
  city: '',
  template: 'modern',
};

/* Smart Military-to-Civilian C.V Builder — Army, Navy, Air Force and CAPF. */
export default function CVBuilder() {
  const { t, lang } = useLang();
  const [form, setForm] = useState<CvInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CvInput, string>>>({});
  const [translating, setTranslating] = useState(false);
  const [profile, setProfile] = useState<CorporateProfile | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  /* Ranks and trades cascade from the selected force. */
  const activeForce = useMemo(() => (form.forceId ? findForce(form.forceId) : null), [form.forceId]);

  const set = <K extends keyof CvInput>(key: K, value: CvInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* Switching force invalidates rank & trade selections. */
  const changeForce = (forceId: string) => {
    setForm((f) => ({ ...f, forceId, rankId: '', tradeId: '' }));
    setErrors((e) => ({ ...e, forceId: undefined, rankId: undefined, tradeId: undefined }));
  };

  /* Keep the preview in sync when the language flips. */
  useEffect(() => {
    if (profile) setProfile(buildProfile(t, lang, profile.input));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof CvInput, string>> = {};
    if (!form.name.trim()) next.name = t.cv.errors.name;
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = t.cv.errors.phone;
    if (!form.forceId) next.forceId = t.cv.errors.force;
    if (!form.rankId) next.rankId = t.cv.errors.rank;
    if (!form.tradeId) next.tradeId = t.cv.errors.corps;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const runTranslate = () => {
    if (!validate()) return;
    setTranslating(true);
    const wait = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : 1000;
    window.setTimeout(() => {
      setProfile(buildProfile(t, lang, form));
      setTranslating(false);
      setDownloaded(false);
    }, wait);
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setProfile(null);
    setDownloaded(false);
  };

  /* Template can be switched after translation without re-running it. */
  const pickTemplate = (template: CvTemplate) => {
    set('template', template);
    setProfile((prev) => (prev ? { ...prev, template, input: { ...prev.input, template } } : prev));
    setDownloaded(false);
  };

  const inputCls = (bad?: string) =>
    `w-full bg-camo-950/70 border rounded-sm px-3.5 py-2.5 text-[14px] text-cream-100 placeholder:text-olive-300/60 transition-colors focus:outline-none focus:border-gold-400 disabled:opacity-50 disabled:cursor-not-allowed ${
      bad ? 'border-brick-500' : 'border-olive-500/50'
    }`;

  return (
    <section id="cv" className="camo-light relative scroll-mt-24 text-ink-900">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-olive-600">
              <IconStar width={12} height={12} className="text-gold-600" />
              {t.cv.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold uppercase text-camo-900 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
              {t.cv.heading}
            </h2>
            <p className="mt-4 text-olive-600 text-[15px] leading-relaxed">{t.cv.sub}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-start">
          {/* ---------- Form ---------- */}
          <Reveal delay={100}>
            <div className="camo-dark border-2 border-camo-900 rounded-sm p-6 sm:p-8 shadow-[8px_8px_0_rgba(58,75,50,0.55)]">
              <h3 className="flex items-center gap-3 font-display font-semibold uppercase tracking-[0.14em] text-gold-300 text-sm">
                <IconShield width={18} height={18} />
                {t.cv.formTitle}
              </h3>

              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="cv-name" className="block text-[12.5px] font-semibold text-cream-200 mb-1.5">
                    {t.cv.fields.name} <span className="text-gold-400">*</span>
                  </label>
                  <input
                    id="cv-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder={t.cv.fields.namePh}
                    className={inputCls(errors.name)}
                  />
                  {errors.name && <p className="mt-1.5 text-[11.5px] text-brick-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="cv-phone" className="block text-[12.5px] font-semibold text-cream-200 mb-1.5">
                    {t.cv.fields.phone} <span className="text-gold-400">*</span>
                  </label>
                  <input
                    id="cv-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder={t.cv.fields.phonePh}
                    className={inputCls(errors.phone)}
                  />
                  {errors.phone && <p className="mt-1.5 text-[11.5px] text-brick-500">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="cv-years" className="block text-[12.5px] font-semibold text-cream-200 mb-1.5">
                    {t.cv.fields.years}
                  </label>
                  <input
                    id="cv-years"
                    type="number"
                    min={1}
                    max={45}
                    value={form.years}
                    onChange={(e) => set('years', e.target.value)}
                    placeholder="15"
                    className={inputCls()}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cv-force" className="block text-[12.5px] font-semibold text-cream-200 mb-1.5">
                    {t.cv.fields.force} <span className="text-gold-400">*</span>
                  </label>
                  <select
                    id="cv-force"
                    value={form.forceId}
                    onChange={(e) => changeForce(e.target.value)}
                    className={inputCls(errors.forceId)}
                  >
                    <option value="">{t.cv.fields.forcePh}</option>
                    {FORCES.map((f) => (
                      <option key={f.id} value={f.id}>
                        {lang === 'en' ? f.en : `${f.hi}`}
                      </option>
                    ))}
                  </select>
                  {errors.forceId && <p className="mt-1.5 text-[11.5px] text-brick-500">{errors.forceId}</p>}
                </div>

                <div>
                  <label htmlFor="cv-rank" className="block text-[12.5px] font-semibold text-cream-200 mb-1.5">
                    {t.cv.fields.rank} <span className="text-gold-400">*</span>
                  </label>
                  <select
                    id="cv-rank"
                    value={form.rankId}
                    disabled={!activeForce}
                    onChange={(e) => set('rankId', e.target.value)}
                    className={inputCls(errors.rankId)}
                  >
                    <option value="">{t.cv.fields.rankPh}</option>
                    {activeForce?.ranks.map((r) => (
                      <option key={r.id} value={r.id}>
                        {lang === 'en' ? r.en : `${r.hi} (${r.en})`}
                      </option>
                    ))}
                  </select>
                  {errors.rankId && <p className="mt-1.5 text-[11.5px] text-brick-500">{errors.rankId}</p>}
                </div>

                <div>
                  <label htmlFor="cv-trade" className="block text-[12.5px] font-semibold text-cream-200 mb-1.5">
                    {t.cv.fields.corps} <span className="text-gold-400">*</span>
                  </label>
                  <select
                    id="cv-trade"
                    value={form.tradeId}
                    disabled={!activeForce}
                    onChange={(e) => set('tradeId', e.target.value)}
                    className={inputCls(errors.tradeId)}
                  >
                    <option value="">{t.cv.fields.corpsPh}</option>
                    {activeForce?.trades.map((tr) => (
                      <option key={tr.id} value={tr.id}>
                        {lang === 'en' ? tr.en : `${tr.hi} (${tr.en})`}
                      </option>
                    ))}
                  </select>
                  {errors.tradeId && <p className="mt-1.5 text-[11.5px] text-brick-500">{errors.tradeId}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cv-city" className="block text-[12.5px] font-semibold text-cream-200 mb-1.5">
                    {t.cv.fields.city}
                  </label>
                  <input
                    id="cv-city"
                    type="text"
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    placeholder={t.cv.fields.cityPh}
                    className={inputCls()}
                  />
                </div>
              </div>

              {/* Template picker */}
              <fieldset className="mt-7">
                <legend className="font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300 mb-3">
                  {t.cv.templateLabel}
                </legend>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {t.cv.templates.map((tpl) => {
                    const on = form.template === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => pickTemplate(tpl.id as CvTemplate)}
                        aria-pressed={on}
                        className={`text-left border-2 rounded-sm p-3.5 transition-all duration-200 ${
                          on ? 'border-gold-400 bg-gold-400/10 -translate-y-0.5' : 'border-olive-500/50 bg-camo-950/40 hover:border-olive-300'
                        }`}
                      >
                        <span className={`block font-display font-semibold uppercase tracking-[0.06em] text-[12.5px] ${on ? 'text-gold-300' : 'text-cream-100'}`}>
                          {tpl.name}
                        </span>
                        <span className="block mt-1 text-[11px] leading-relaxed text-olive-300">{tpl.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-7 flex flex-col sm:flex-row gap-3.5">
                <button
                  type="button"
                  onClick={runTranslate}
                  disabled={translating}
                  className={`flex-1 inline-flex items-center justify-center gap-2.5 btn-stamp font-display font-semibold uppercase tracking-[0.1em] text-[13px] px-6 py-3.5 rounded-sm ${
                    translating ? 'shimmer bg-gold-500 text-camo-950 cursor-wait' : 'bg-gold-400 text-camo-950'
                  }`}
                >
                  <IconSpark width={17} height={17} />
                  {translating ? t.cv.translating : t.cv.translateBtn}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 border-2 border-olive-400 text-cream-200 hover:border-gold-400 hover:text-gold-300 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-3.5 rounded-sm transition-colors"
                  >
                    {t.cv.resetBtn}
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* ---------- Preview ---------- */}
          <Reveal delay={220}>
            <div className="relative camo-dark border-2 border-gold-400/60 rounded-sm overflow-hidden shadow-[8px_8px_0_rgba(240,180,41,0.35)]">
              <div className="flex items-center justify-between bg-camo-950 border-b border-gold-400/40 px-5 py-3">
                <h3 className="flex items-center gap-2.5 font-display font-semibold uppercase tracking-[0.14em] text-gold-300 text-sm">
                  <IconFile width={17} height={17} />
                  {t.cv.previewTitle}
                </h3>
                <span
                  className={`font-mono text-[9.5px] tracking-[0.18em] px-2 py-1 rounded-sm border ${
                    profile ? 'text-gold-300 border-gold-400/50 bg-gold-400/10' : 'text-olive-300 border-olive-500/50'
                  }`}
                >
                  {profile ? t.cv.previewReady : t.cv.previewStatus}
                </span>
              </div>

              {!profile ? (
                <div className="p-10 sm:p-14 flex flex-col items-center text-center min-h-[420px] justify-center">
                  <div className="relative">
                    <IconRadar width={64} height={64} className="text-olive-400" />
                    <span className="absolute inset-0 rounded-full border border-gold-400/40 radar-ring" />
                  </div>
                  <p className="mt-6 max-w-xs text-[13.5px] leading-relaxed text-olive-300">{t.cv.previewEmpty}</p>
                  <div className="mt-6 flex gap-2" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rotate-45 border border-olive-400" />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-7">
                  <div className="border border-dashed border-gold-400/50 rounded-sm p-5 relative">
                    <span className="absolute -top-2 left-4 bg-camo-900 px-2 font-mono text-[9px] tracking-[0.24em] text-gold-400">
                      CORPORATE ID
                    </span>
                    <p className="font-display font-bold uppercase text-cream-50 text-2xl tracking-[0.05em] leading-tight">
                      {profile.input.name}
                    </p>
                    <p className="mt-1.5 font-display font-semibold text-gold-400 uppercase tracking-[0.08em] text-[15px]">
                      {profile.corporateTitle}
                    </p>
                    <p className="mt-1 text-[12px] text-olive-300">
                      {t.cv.labels.domain}: <span className="text-cream-200">{profile.domain}</span>
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="flex items-center gap-2 font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300">
                      <span className="w-1.5 h-1.5 bg-gold-400 rotate-45" />
                      {t.cv.labels.summary}
                    </h4>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-cream-200/90">{profile.summary}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="flex items-center gap-2 font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300">
                      <span className="w-1.5 h-1.5 bg-gold-400 rotate-45" />
                      {t.cv.labels.skills}
                    </h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.skills.map((s) => (
                        <span key={s} className="text-[11.5px] font-medium bg-cream-100 text-camo-800 border border-cream-300 px-2.5 py-1.5 rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="flex items-center gap-2 font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300">
                      <span className="w-1.5 h-1.5 bg-gold-400 rotate-45" />
                      {t.cv.labels.service}
                    </h4>
                    <dl className="mt-3 grid grid-cols-2 gap-px bg-camo-700 border border-camo-700 rounded-sm overflow-hidden text-[12.5px]">
                      {[
                        [t.cv.labels.force, profile.forceLabel],
                        [t.cv.labels.rank, profile.rankLabel],
                        [t.cv.labels.corps, profile.tradeLabel],
                        [t.cv.labels.years, `${profile.input.years || '10+'} yrs`],
                        [t.cv.labels.contact, `+91 ${profile.input.phone}`],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-camo-900 px-3.5 py-2.5">
                          <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-olive-300">{k}</dt>
                          <dd className="mt-0.5 text-cream-100">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="mt-7 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        generateCvPdf(profile);
                        setDownloaded(true);
                      }}
                      className={`inline-flex items-center justify-center gap-2.5 btn-stamp font-display font-semibold uppercase tracking-[0.1em] text-[13px] px-6 py-3.5 rounded-sm ${
                        downloaded ? 'bg-olive-500 text-cream-100' : 'bg-gold-400 text-camo-950'
                      }`}
                    >
                      {downloaded ? <IconCheck width={17} height={17} strokeWidth={2.4} /> : <IconDownload width={17} height={17} />}
                      {t.cv.pdfBtn}
                    </button>
                    <p className="text-center text-[11px] text-olive-300">{t.cv.pdfNote}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
