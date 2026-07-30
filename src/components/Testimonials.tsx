import { useLang } from '../i18n';
import Reveal from './Reveal';
import { IconStar, IconMedal } from './icons';

/* Field reports — staggered testimonial cards. */
export default function Testimonials() {
  const { t } = useLang();

  return (
    <section className="relative bg-olive-600 overflow-hidden">
      <div className="noise-overlay" />
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #12180e 0 2px, transparent 2px 26px)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-gold-300">
              <IconStar width={12} height={12} />
              {t.testimonials.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold uppercase text-cream-50 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
              {t.testimonials.heading}
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6 lg:gap-8">
          {t.testimonials.quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 140} className={i === 1 ? 'lg:translate-y-8' : ''}>
              <figure className="relative h-full camo-dark border border-olive-500/60 rounded-sm p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-1.5 hover:border-gold-400/60">
                <span
                  className="absolute -top-5 left-5 font-display font-bold text-[64px] leading-none text-gold-400/90 select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="pt-6 text-[13.5px] leading-relaxed text-cream-100/90">{q.text}</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-dashed border-olive-500/50 flex items-center gap-3.5">
                  <span className="w-11 h-11 shrink-0 rounded-full bg-gold-400 text-camo-950 flex items-center justify-center">
                    <IconMedal width={22} height={22} />
                  </span>
                  <span>
                    <span className="block font-display font-semibold uppercase tracking-[0.08em] text-cream-50 text-[13.5px]">
                      {q.name}
                    </span>
                    <span className="block mt-0.5 text-[11.5px] text-gold-300/90">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
