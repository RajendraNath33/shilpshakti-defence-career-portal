import { useRef, useState } from 'react';
import { useLang } from '../i18n';
import Reveal from './Reveal';
import { IconCamera, IconUpload, IconSpark, IconDownload, IconCheck, IconStar, IconX } from './icons';

type Phase = 'idle' | 'ready' | 'processing' | 'done';
type PresetId = 'blacksuit' | 'blueblazer' | 'formalshirt';
type BgId = 'white' | 'offwhite' | 'lightblue';

const PRESET_FILTERS: Record<PresetId, string> = {
  blacksuit: 'contrast(1.10) brightness(1.03) saturate(0.94)',
  blueblazer: 'contrast(1.07) brightness(1.05) saturate(1.04)',
  formalshirt: 'contrast(1.04) brightness(1.06) saturate(1.0)',
};

const PRESET_SWATCH: Record<PresetId, string> = {
  blacksuit: '#191c21',
  blueblazer: '#27406b',
  formalshirt: '#e8ecf2',
};

const BG_COLORS: Record<BgId, string> = {
  white: '#ffffff',
  offwhite: '#f7f4ec',
  lightblue: '#dce8f7',
};

/* Passport canvas: 35 x 45 mm at ~300 dpi. */
const PW = 413;
const PH = 531;
const ASPECT = PW / PH;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const todayIso = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatDop = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

interface CropState {
  zoom: number;
  offsetX: number;
  offsetY: number;
  frameWidth: number;
}

interface OverlayState {
  enabled: boolean;
  name: string;
  date: string;
}

/* Renders the cropped, colour-corrected passport photo with optional
   name + date-of-photo strip, using the exact transform shown in the
   crop preview so what the user frames is what they get. */
function drawPassport(
  img: HTMLImageElement,
  preset: PresetId,
  bg: BgId,
  crop: CropState,
  overlay: OverlayState
): string {
  const canvas = document.createElement('canvas');
  canvas.width = PW;
  canvas.height = PH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = BG_COLORS[bg];
  ctx.fillRect(0, 0, PW, PH);

  // Preview -> canvas scale factor
  const frameW = crop.frameWidth || PW;
  const frameH = frameW / ASPECT;
  const k = PW / frameW;

  const baseScale = Math.max(frameW / img.width, frameH / img.height);
  const drawW = img.width * baseScale * crop.zoom;
  const drawH = img.height * baseScale * crop.zoom;
  const dx = frameW / 2 + crop.offsetX - drawW / 2;
  const dy = frameH / 2 + crop.offsetY - drawH / 2;

  ctx.filter = PRESET_FILTERS[preset];
  ctx.drawImage(img, dx * k, dy * k, drawW * k, drawH * k);
  ctx.filter = 'none';

  if (overlay.enabled && (overlay.name.trim() || overlay.date)) {
    const stripH = Math.round(PH * 0.13);
    const gradient = ctx.createLinearGradient(0, PH - stripH * 1.5, 0, PH);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.45, 'rgba(255,255,255,0.88)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.97)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, PH - stripH * 1.5, PW, stripH * 1.5);

    ctx.textAlign = 'center';
    const name = overlay.name.trim().toUpperCase();
    if (name) {
      let fontSize = 30;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      while (ctx.measureText(name).width > PW - 28 && fontSize > 14) {
        fontSize -= 1;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      }
      ctx.fillStyle = '#111111';
      ctx.fillText(name, PW / 2, PH - 34);
    }
    if (overlay.date) {
      ctx.font = '22px Arial, sans-serif';
      ctx.fillStyle = '#1f1f1f';
      ctx.fillText(`D.O.P: ${formatDop(overlay.date)}`, PW / 2, PH - 10);
    }
  }

  return canvas.toDataURL('image/png');
}

/* Builds a 4 x 2 print sheet with dashed cut guides. */
function buildSheet(photo: string, bg: BgId): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const margin = 34;
      const gap = 22;
      const headerH = 64;
      const cols = 4;
      const rows = 2;
      const W = margin * 2 + cols * PW + (cols - 1) * gap;
      const H = margin * 2 + headerH + rows * PH + (rows - 1) * gap;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      ctx.fillStyle = '#fdfdfc';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1b2416';
      ctx.fillRect(0, 0, W, headerH + margin - 10);
      ctx.fillStyle = '#ffc947';
      ctx.font = 'bold 26px Oswald, Arial, sans-serif';
      ctx.fillText('SHILPSHAKTI AI PHOTO STUDIO', margin, margin + 12);
      ctx.fillStyle = '#f4f6f3';
      ctx.font = '18px Arial, sans-serif';
      ctx.fillText('35 x 45 mm  •  Passport / Exam Form Size  •  8 Copies', margin, margin + 40);

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = margin + c * (PW + gap);
          const y = margin + headerH + r * (PH + gap);
          ctx.fillStyle = BG_COLORS[bg];
          ctx.fillRect(x, y, PW, PH);
          ctx.strokeStyle = '#b9c0b2';
          ctx.setLineDash([8, 8]);
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x - 5, y - 5, PW + 10, PH + 10);
          ctx.setLineDash([]);
          ctx.drawImage(img, x, y, PW, PH);
        }
      }
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = photo;
  });
}

/* AI Passport Photo Studio — crop, background, attire prompt and overlay. */
export default function PhotoStudio() {
  const { t, lang } = useLang();
  const [src, setSrc] = useState<string | null>(null);
  const [preset, setPreset] = useState<PresetId>('blacksuit');
  const [bg, setBg] = useState<BgId>('white');
  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [overlay, setOverlay] = useState<OverlayState>({ enabled: true, name: '', date: todayIso() });

  const fileRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ active: boolean; startX: number; startY: number; originX: number; originY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const timerRef = useRef<number | null>(null);

  const resetCrop = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  /* Strict type + size validation before anything touches the canvas. */
  const acceptFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setFileError(t.photo.errors.type);
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError(t.photo.errors.size);
      return;
    }
    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(String(reader.result));
      setResult(null);
      resetCrop();
      setPhase('ready');
    };
    reader.readAsDataURL(file);
  };

  const useSample = () => {
    setFileError('');
    setSrc('images/sample-photo.jpg');
    setResult(null);
    resetCrop();
    setPhase('ready');
  };

  /* Keeps the image covering the frame at all times. */
  const clampOffset = (nx: number, ny: number, currentZoom: number) => {
    const frame = frameRef.current;
    if (!frame) return { x: nx, y: ny };
    const fw = frame.clientWidth;
    const fh = fw / ASPECT;
    const img = imgSizeRef.current;
    if (!img.w || !img.h) return { x: nx, y: ny };
    const baseScale = Math.max(fw / img.w, fh / img.h);
    const drawW = img.w * baseScale * currentZoom;
    const drawH = img.h * baseScale * currentZoom;
    const maxX = Math.max(0, (drawW - fw) / 2);
    const maxY = Math.max(0, (drawH - fh) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, nx)),
      y: Math.min(maxY, Math.max(-maxY, ny)),
    };
  };

  const imgSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    panRef.current = { active: true, startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!panRef.current.active) return;
    const nx = panRef.current.originX + (e.clientX - panRef.current.startX);
    const ny = panRef.current.originY + (e.clientY - panRef.current.startY);
    setOffset(clampOffset(nx, ny, zoom));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    panRef.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const changeZoom = (z: number) => {
    setZoom(z);
    setOffset((o) => clampOffset(o.x, o.y, z));
  };

  const transform = async () => {
    if (!src) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setPhase('processing');
    setStep(0);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stepMs = reduced ? 120 : 620;

    try {
      const img = await loadImage(src);
      for (let i = 0; i < t.photo.processing.length; i += 1) {
        setStep(i);
        await new Promise((r) => {
          timerRef.current = window.setTimeout(r, stepMs);
        });
      }
      const frameWidth = frameRef.current?.clientWidth ?? PW;
      setResult(drawPassport(img, preset, bg, { zoom, offsetX: offset.x, offsetY: offset.y, frameWidth }, overlay));
      setPhase('done');
    } catch {
      setPhase('ready');
    }
  };

  const retake = () => {
    setSrc(null);
    setResult(null);
    setPhase('idle');
    setFileError('');
    resetCrop();
    if (fileRef.current) fileRef.current.value = '';
  };

  const downloadSingle = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'shilpshakti-passport-photo.png';
    a.click();
  };

  const downloadSheet = async () => {
    if (!result) return;
    const sheet = await buildSheet(result, bg);
    if (!sheet) return;
    const a = document.createElement('a');
    a.href = sheet;
    a.download = 'shilpshakti-passport-photo-sheet.png';
    a.click();
  };

  return (
    <section id="photo" className="camo-dark relative scroll-mt-24 overflow-hidden">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-gold-400">
              <IconStar width={12} height={12} />
              {t.photo.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold uppercase text-cream-50 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
              {t.photo.heading}
            </h2>
            <p className="mt-4 text-cream-200/80 text-[15px] leading-relaxed">{t.photo.sub}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-start">
          {/* ---------- Controls ---------- */}
          <Reveal delay={100}>
            <div className="border-2 border-olive-500/60 bg-camo-800/70 rounded-sm p-6 sm:p-8">
              {!src ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    acceptFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`border-2 border-dashed rounded-sm px-6 py-12 text-center transition-all duration-200 ${
                    dragging ? 'border-gold-400 bg-gold-400/10 scale-[1.01]' : 'border-olive-400/60 bg-camo-950/50 hover:border-gold-400/70'
                  }`}
                >
                  <IconCamera width={42} height={42} className="mx-auto text-gold-400" />
                  <p className="mt-4 font-display font-semibold uppercase tracking-[0.1em] text-cream-100 text-[15px]">
                    {t.photo.dropTitle}
                  </p>
                  <p className="mt-1.5 text-[12.5px] text-olive-300">{t.photo.dropSub}</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 btn-stamp bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-2.5 rounded-sm"
                    >
                      <IconUpload width={15} height={15} />
                      {t.photo.browse}
                    </button>
                    <button
                      type="button"
                      onClick={useSample}
                      className="inline-flex items-center gap-2 border-2 border-olive-400 text-cream-200 hover:border-gold-400 hover:text-gold-300 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-2.5 rounded-sm transition-colors"
                    >
                      <IconCamera width={15} height={15} />
                      {t.photo.sample}
                    </button>
                  </div>
                </div>
              ) : (
                /* ---------- Crop workspace ---------- */
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300">{t.photo.cropTitle}</p>
                    <button
                      type="button"
                      onClick={retake}
                      className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold border border-olive-400/70 text-cream-200 hover:border-brick-500 hover:text-brick-500 px-2.5 py-1 rounded-sm transition-colors"
                    >
                      <IconX width={12} height={12} />
                      {t.photo.retake}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-5 items-start">
                    <div
                      ref={frameRef}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerUp}
                      className="relative w-[176px] shrink-0 overflow-hidden rounded-sm border-2 border-gold-400/70 cursor-grab active:cursor-grabbing touch-none select-none"
                      style={{ aspectRatio: '35 / 45', backgroundColor: BG_COLORS[bg] }}
                    >
                      <img
                        src={src}
                        alt="Crop preview"
                        draggable={false}
                        onLoad={(e) => {
                          const el = e.currentTarget;
                          imgSizeRef.current = { w: el.naturalWidth, h: el.naturalHeight };
                        }}
                        className="absolute left-1/2 top-1/2 max-w-none pointer-events-none"
                        style={{
                          transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: PRESET_FILTERS[preset],
                        }}
                      />
                      {/* Head guide */}
                      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <div className="absolute left-1/2 top-[14%] h-[62%] w-[54%] -translate-x-1/2 rounded-[50%] border border-dashed border-gold-400/50" />
                        <div className="absolute inset-x-0 bottom-0 h-[13%] border-t border-dashed border-gold-400/40" />
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <p className="text-[11.5px] text-olive-300 leading-relaxed">{t.photo.cropHint}</p>
                      <label htmlFor="crop-zoom" className="mt-4 block text-[12px] font-semibold text-cream-200">
                        {t.photo.zoom} — {zoom.toFixed(1)}×
                      </label>
                      <input
                        id="crop-zoom"
                        type="range"
                        min={1}
                        max={3}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => changeZoom(Number(e.target.value))}
                        className="mt-2 w-full accent-[#ffc947]"
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold border border-olive-400/70 text-cream-200 hover:border-gold-400 hover:text-gold-300 px-3 py-1.5 rounded-sm transition-colors"
                      >
                        <IconUpload width={13} height={13} />
                        {t.photo.browse}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />

              {fileError && (
                <p className="mt-4 border-l-4 border-brick-500 bg-brick-500/10 px-3.5 py-2.5 text-[12.5px] text-brick-500 font-medium">
                  {fileError}
                </p>
              )}

              {/* Background colour */}
              <div className="mt-7">
                <p className="font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300">{t.photo.bgLabel}</p>
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {t.photo.backgrounds.map((b) => {
                    const id = b.id as BgId;
                    const on = bg === id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBg(id)}
                        aria-pressed={on}
                        className={`flex items-center gap-2.5 border-2 rounded-sm px-3 py-2.5 transition-all duration-200 ${
                          on ? 'border-gold-400 bg-gold-400/10 -translate-y-0.5' : 'border-olive-500/50 bg-camo-950/40 hover:border-olive-300'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-sm border border-cream-200/50" style={{ backgroundColor: BG_COLORS[id] }} aria-hidden="true" />
                        <span className={`text-[12px] font-semibold ${on ? 'text-gold-300' : 'text-cream-200'}`}>{b.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Attire prompt */}
              <div className="mt-6">
                <p className="font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300">{t.photo.presetLabel}</p>
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {t.photo.presets.map((p) => {
                    const id = p.id as PresetId;
                    const on = preset === id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPreset(id)}
                        aria-pressed={on}
                        className={`flex flex-col items-center gap-2 border-2 rounded-sm py-3.5 px-2 transition-all duration-200 ${
                          on ? 'border-gold-400 bg-gold-400/10 -translate-y-0.5' : 'border-olive-500/50 bg-camo-950/40 hover:border-olive-300'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-full border-2 border-cream-200/40" style={{ backgroundColor: PRESET_SWATCH[id] }} aria-hidden="true" />
                        <span className={`text-[12px] font-semibold ${on ? 'text-gold-300' : 'text-cream-200'}`}>
                          {lang === 'en' ? p.en : p.hi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & date overlay */}
              <div className="mt-6 border-2 border-olive-500/50 bg-camo-950/40 rounded-sm p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overlay.enabled}
                    onChange={(e) => setOverlay((o) => ({ ...o, enabled: e.target.checked }))}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 w-5 h-5 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors ${
                      overlay.enabled ? 'bg-gold-400 border-gold-400 text-camo-950' : 'border-olive-400 text-transparent'
                    }`}
                    aria-hidden="true"
                  >
                    <IconCheck width={13} height={13} strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block font-display uppercase tracking-[0.14em] text-[11.5px] text-gold-300">
                      {t.photo.overlayLabel}
                    </span>
                    <span className="block mt-1 text-[11.5px] leading-relaxed text-cream-200/75">{t.photo.overlayToggle}</span>
                  </span>
                </label>

                {overlay.enabled && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ov-name" className="block text-[12px] font-semibold text-cream-200 mb-1.5">
                        {t.photo.overlayName}
                      </label>
                      <input
                        id="ov-name"
                        type="text"
                        value={overlay.name}
                        onChange={(e) => setOverlay((o) => ({ ...o, name: e.target.value }))}
                        placeholder={t.photo.overlayNamePh}
                        className="w-full bg-camo-950/70 border border-olive-500/50 rounded-sm px-3 py-2 text-[13.5px] text-cream-100 placeholder:text-olive-300/60 focus:outline-none focus:border-gold-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="ov-date" className="block text-[12px] font-semibold text-cream-200 mb-1.5">
                        {t.photo.overlayDate}
                      </label>
                      <input
                        id="ov-date"
                        type="date"
                        value={overlay.date}
                        onChange={(e) => setOverlay((o) => ({ ...o, date: e.target.value }))}
                        className="w-full bg-camo-950/70 border border-olive-500/50 rounded-sm px-3 py-2 text-[13.5px] text-cream-100 focus:outline-none focus:border-gold-400 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Transform */}
              <button
                type="button"
                onClick={transform}
                disabled={!src || phase === 'processing'}
                className={`mt-7 w-full inline-flex items-center justify-center gap-2.5 btn-stamp font-display font-semibold uppercase tracking-[0.1em] text-[13px] px-6 py-3.5 rounded-sm ${
                  !src || phase === 'processing' ? 'shimmer bg-olive-500 text-cream-100 cursor-not-allowed' : 'bg-gold-400 text-camo-950'
                }`}
              >
                <IconSpark width={17} height={17} />
                {phase === 'processing' ? t.photo.processing[step] : t.photo.transform}
              </button>

              {phase === 'processing' && (
                <ul className="mt-5 space-y-2">
                  {t.photo.processing.map((label, i) => (
                    <li key={label} className={`flex items-center gap-2.5 text-[12.5px] ${i <= step ? 'text-gold-300' : 'text-olive-300/60'}`}>
                      {i < step ? (
                        <IconCheck width={14} height={14} strokeWidth={2.6} className="text-gold-400" />
                      ) : (
                        <span className={`w-3.5 h-3.5 rounded-full border ${i === step ? 'border-gold-400 animate-pulse' : 'border-olive-400/50'}`} />
                      )}
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>

          {/* ---------- Result ---------- */}
          <Reveal delay={220}>
            <div className="border-2 border-gold-400/60 bg-camo-950/80 rounded-sm overflow-hidden shadow-[8px_8px_0_rgba(240,180,41,0.35)]">
              <div className="flex items-center justify-between border-b border-gold-400/40 px-5 py-3">
                <h3 className="font-display font-semibold uppercase tracking-[0.14em] text-gold-300 text-sm">{t.photo.resultTitle}</h3>
                <span className="font-mono text-[9.5px] tracking-[0.18em] text-olive-300">{t.photo.sizeNote}</span>
              </div>

              {phase === 'done' && result ? (
                <div className="p-6 sm:p-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-3 border border-dashed border-gold-400/50 rounded-sm" aria-hidden="true" />
                      <img
                        src={result}
                        alt="AI transformed passport photo preview"
                        className="relative w-52 sm:w-60 rounded-sm border border-cream-300 shadow-[0_18px_44px_rgba(0,0,0,0.55)]"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={downloadSheet}
                      className="inline-flex items-center justify-center gap-2.5 btn-stamp bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.1em] text-[13px] px-6 py-3.5 rounded-sm"
                    >
                      <IconDownload width={17} height={17} />
                      {t.photo.download}
                    </button>
                    <button
                      type="button"
                      onClick={downloadSingle}
                      className="inline-flex items-center justify-center gap-2 border-2 border-olive-400 text-cream-200 hover:border-gold-400 hover:text-gold-300 font-display font-semibold uppercase tracking-[0.1em] text-[12.5px] px-5 py-3 rounded-sm transition-colors"
                    >
                      <IconDownload width={15} height={15} />
                      {t.photo.downloadSingle}
                    </button>
                    <p className="text-center text-[11px] text-olive-300 leading-relaxed">{t.photo.note}</p>
                  </div>
                </div>
              ) : (
                <div className="p-10 sm:p-14 flex flex-col items-center justify-center text-center min-h-[420px]">
                  {phase === 'processing' ? (
                    <>
                      <div className="w-24 h-32 rounded-sm border-2 border-gold-400/60 shimmer bg-camo-800" aria-hidden="true" />
                      <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-gold-300 uppercase">AI ENGINE // STEP {step + 1}/4</p>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-32 rounded-sm border-2 border-dashed border-olive-400/60 flex items-center justify-center" aria-hidden="true">
                        <IconCamera width={30} height={30} className="text-olive-400" />
                      </div>
                      <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-olive-300">{t.photo.waiting}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
