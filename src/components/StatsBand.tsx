import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';

/* Gold stats band with count-up numbers triggered on scroll. */
export default function StatsBand() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-gold-400 border-y-4 border-camo-950 relative overflow-hidden">
      <div
        className="absolute inset-y-0 -left-6 w-24 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #12180e 0 10px, transparent 10px 22px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 -right-6 w-24 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #12180e 0 10px, transparent 10px 22px)' }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-y-7">
        {t.stats.values.map((value, i) => (
          <Counter key={t.stats.labels[i]} target={value} suffix={t.stats.suffix[i]} label={t.stats.labels[i]} run={run} />
        ))}
      </div>
    </div>
  );
}

function Counter({ target, suffix, label, run }: { target: number; suffix: string; label: string; run: boolean }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!run) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVal(target);
      return;
    }
    const duration = 1500;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  return (
    <div className="text-center lg:text-left lg:px-6 lg:border-l-2 lg:border-camo-950/15 first:border-0">
      <p className="font-display font-bold text-camo-950 text-3xl sm:text-4xl xl:text-[2.7rem] leading-none tabular-nums">
        {val.toLocaleString('en-IN')}
        {suffix && <span className="text-camo-800">{suffix}</span>}
      </p>
      <p className="mt-2 font-display uppercase tracking-[0.16em] text-[11px] sm:text-xs text-camo-800/90">{label}</p>
    </div>
  );
}
