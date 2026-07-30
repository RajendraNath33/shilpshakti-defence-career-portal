import { useLang } from '../i18n';
import Reveal from './Reveal';
import { IconUsers, IconSwap, IconFile, IconTarget, IconStar } from './icons';

const STEP_ICONS = [IconUsers, IconSwap, IconFile, IconTarget];

/* Four-step mission plan with a marching dashed route line. */
export default function ProcessSteps() {
  const { t } = useLang();

  return (
    <section className="camo-dark relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-gold-400">
              <IconStar width={12} height={12} />
              {t.process.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold uppercase text-cream-50 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
              {t.process.heading}
            </h2>
            <p className="mt-4 text-cream-200/80 text-[15px] leading-relaxed">{t.process.sub}</p>
          </div>
        </Reveal>

        {/* Route line (desktop) */}
        <div className="relative mt-14">
          <svg
            className="hidden lg:block absolute left-0 right-0 top-[46px] w-full h-2 text-gold-400/60"
            aria-hidden="true"
            preserveAspectRatio="none"
            viewBox="0 0 100 2"
          >
            <line x1="2" y1="1" x2="98" y2="1" stroke="currentColor" strokeWidth="0.6" className="route-dash" />
          </svg>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {t.process.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <Reveal key={step.title} delay={i * 130}>
                  <div className="group relative">
                    {/* Number node */}
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-[64px] h-[64px] shrink-0 rounded-full border-2 border-olive-500 bg-camo-900 flex items-center justify-center text-gold-400 transition-all duration-300 group-hover:border-gold-400 group-hover:shadow-[0_0_28px_rgba(255,201,71,0.25)]">
                        <Icon width={26} height={26} />
                      </div>
                      <span className="font-display font-bold text-5xl text-camo-700 leading-none transition-colors duration-300 group-hover:text-gold-400/80">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display font-semibold uppercase tracking-[0.08em] text-cream-50 text-lg">
                      {step.title}
                    </h3>
                    <div className="mt-2 w-10 h-0.5 bg-gold-400/70 transition-all duration-500 group-hover:w-16" />
                    <p className="mt-3 text-[13.5px] leading-relaxed text-cream-200/75">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
