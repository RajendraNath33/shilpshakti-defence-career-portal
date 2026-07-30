import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { useScramble } from '../hooks/useScramble';
import Reveal from './Reveal';
import { IconArrowRight, IconChevrons, IconCheck, IconSwap, IconShield, IconCap } from './icons';

/* Dual hero — Ex-Servicemen ↔ Youth, with decode headline and 3D flip card. */
export default function Hero() {
  const { t } = useLang();
  const scrambled = useScramble(t.hero.titleB);
  const [flipped, setFlipped] = useState(false);
  const interacted = useRef(false);

  /* Gentle auto-flip until the visitor takes control. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (interacted.current) {
        window.clearInterval(id);
        return;
      }
      setFlipped((f) => !f);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const flip = () => {
    interacted.current = true;
    setFlipped((f) => !f);
  };

  const card = t.hero.card;

  return (
    <section id="top" className="camo-dark relative overflow-hidden">
      <div className="noise-overlay" />
      {/* Faint topo-grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,201,71,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,201,71,0.5) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-20 lg:pt-20 lg:pb-24 grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-10 items-center">
        {/* ---- Left: message ---- */}
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 border border-gold-400/40 bg-camo-950/60 text-gold-300 font-display uppercase tracking-[0.22em] text-[11px] px-3.5 py-1.5 rounded-sm">
              <span className="w-1.5 h-1.5 bg-gold-400 rotate-45" />
              {t.hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 font-display font-bold uppercase leading-[1.04] text-cream-50 text-[2.4rem] sm:text-5xl xl:text-[3.6rem] tracking-tight">
              {t.hero.titleA}
              <br />
              <span className="text-gold-400 [text-shadow:0_0_32px_rgba(255,201,71,0.35)]">{scrambled}</span>{' '}
              {t.hero.titleC}
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-6 max-w-xl text-cream-200/90 text-[15px] sm:text-base leading-relaxed">
              {t.hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#cv"
                className="inline-flex items-center gap-2.5 btn-stamp bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.1em] text-sm px-7 py-3.5 rounded-sm"
              >
                {t.hero.ctaCv}
                <IconArrowRight width={17} height={17} strokeWidth={2.2} />
              </a>
              <a
                href="#jobs"
                className="inline-flex items-center gap-2.5 border-2 border-olive-400 text-cream-100 hover:border-gold-400 hover:text-gold-300 font-display font-semibold uppercase tracking-[0.1em] text-sm px-7 py-3.5 rounded-sm transition-colors duration-200"
              >
                <IconChevrons width={17} height={17} />
                {t.hero.ctaJobs}
              </a>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5">
              {t.hero.trust.map((chip) => (
                <li key={chip} className="flex items-center gap-2 text-[13px] text-cream-200/85">
                  <IconCheck width={14} height={14} className="text-gold-400" strokeWidth={2.4} />
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ---- Right: dual flip card with radar ---- */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-[430px]">
            {/* Radar backdrop */}
            <div className="absolute -inset-8 sm:-inset-12 pointer-events-none" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border border-olive-500/40" />
              <div className="absolute inset-[14%] rounded-full border border-olive-500/30" />
              <div className="absolute inset-[30%] rounded-full border border-olive-500/25" />
              <div className="absolute inset-0 rounded-full radar-sweep" />
              <div className="absolute inset-0 rounded-full border-2 border-gold-400/30 radar-ring" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-olive-300/60 font-mono text-[10px] tracking-widest">
                RADAR // KUMAON SECTOR
              </div>
            </div>

            {/* Flip card */}
            <div className="flip-scene relative aspect-[4/4.6] cursor-pointer select-none" onClick={flip} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } }}
              aria-label={card.tapHint}
            >
              <div className={`flip-inner relative w-full h-full ${flipped ? 'flipped' : ''}`}>
                {/* Front — Ex-Serviceman */}
                <div className="flip-face absolute inset-0 rounded-md overflow-hidden border-2 border-gold-400/70 bg-camo-800 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                  <img src="images/soldier.jpg" alt="Indian Army personnel — Ex-Servicemen track" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-camo-950 via-camo-950/45 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.14em] text-[10.5px] px-3 py-1.5 rounded-sm">
                    <IconShield width={13} height={13} strokeWidth={2.2} />
                    {card.esm.tag}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <h3 className="font-display font-bold uppercase text-cream-50 text-2xl tracking-wide">{card.esm.title}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {card.esm.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-[13px] text-cream-100/90">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-gold-400 rotate-45 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Back — Student / Youth */}
                <div className="flip-face flip-back absolute inset-0 rounded-md overflow-hidden border-2 border-olive-300/80 bg-camo-800 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                  <img src="images/student.jpg" alt="Young student — Youth and Civilian track" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-camo-950 via-camo-950/45 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-cream-100 text-camo-950 font-display font-semibold uppercase tracking-[0.14em] text-[10.5px] px-3 py-1.5 rounded-sm">
                    <IconCap width={13} height={13} strokeWidth={2.2} />
                    {card.youth.tag}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <h3 className="font-display font-bold uppercase text-cream-50 text-2xl tracking-wide">{card.youth.title}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {card.youth.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-[13px] text-cream-100/90">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-gold-400 rotate-45 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Flip control */}
            <div className="relative mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={flip}
                className="inline-flex items-center gap-2 border border-gold-400/60 text-gold-300 hover:bg-gold-400 hover:text-camo-950 font-display font-semibold uppercase tracking-[0.14em] text-xs px-4 py-2 rounded-sm transition-colors duration-200"
              >
                <IconSwap width={15} height={15} />
                {card.flip}
              </button>
              <span className="text-[11px] text-olive-300 tracking-wide">{card.tapHint}</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom edge: stencil cut */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 tricolor opacity-90" aria-hidden="true" />
    </section>
  );
}
