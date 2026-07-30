import { useLang } from '../i18n';
import Reveal from './Reveal';
import { IconStar, IconShield, IconBriefcase, IconCap, IconExternal } from './icons';

const CARD_ICONS = [IconShield, IconBriefcase, IconCap];

/* Important Govt Links — curated official portals grouped in three cards.
   Every link opens in a new tab with noopener/noreferrer. */
export default function GovtLinks() {
  const { t } = useLang();

  return (
    <section id="govt-links" className="camo-dark relative scroll-mt-24 overflow-hidden">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        {/* Section head */}
        <Reveal>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-gold-400">
              <IconStar width={12} height={12} />
              {t.govtLinks.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold uppercase text-cream-50 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
              {t.govtLinks.heading}
            </h2>
            <p className="mt-4 text-cream-200/80 text-[15px] leading-relaxed">{t.govtLinks.sub}</p>
          </div>
        </Reveal>

        {/* Three-column card grid */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-start">
          {t.govtLinks.cards.map((card, i) => {
            const Icon = CARD_ICONS[i];
            return (
              <Reveal key={card.title} delay={i * 120}>
                <article className="group h-full flex flex-col border-2 border-olive-500/60 bg-camo-800/70 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/70 hover:shadow-[8px_8px_0_rgba(240,180,41,0.28)]">
                  {/* Gold accent header */}
                  <header className="flex items-start gap-3 bg-gold-400 text-camo-950 px-5 py-4">
                    <span className="shrink-0 mt-0.5">
                      <Icon width={20} height={20} strokeWidth={2} />
                    </span>
                    <h3 className="font-display font-bold uppercase tracking-[0.06em] text-[15px] leading-snug">
                      {card.title}
                    </h3>
                  </header>

                  {/* Link list */}
                  <ul className="flex-1 divide-y divide-camo-700/80">
                    {card.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-start gap-3 px-5 py-3.5 transition-colors duration-200 hover:bg-camo-950/60"
                        >
                          <span className="mt-2 w-1.5 h-1.5 bg-gold-400 rotate-45 shrink-0" aria-hidden="true" />
                          <span className="flex-1 min-w-0">
                            <span className="block font-semibold text-[13.5px] leading-snug text-cream-100 group-hover/link:text-gold-300 transition-colors">
                              {link.name}
                            </span>
                            <span className="block mt-0.5 text-[11.5px] leading-relaxed text-olive-300">
                              {link.desc}
                            </span>
                          </span>
                          <IconExternal
                            width={14}
                            height={14}
                            className="shrink-0 mt-1 text-olive-400 transition-all duration-200 group-hover/link:text-gold-400 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            aria-label={t.govtLinks.visit}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Disclaimer */}
        <Reveal delay={160}>
          <div className="mt-10 border border-cream-200/35 bg-camo-950/50 rounded-sm px-5 sm:px-7 py-5">
            <p className="flex items-center gap-2 font-display font-semibold uppercase tracking-[0.18em] text-[11.5px] text-gold-300">
              <span className="w-1.5 h-1.5 bg-gold-400 rotate-45" aria-hidden="true" />
              {t.govtLinks.disclaimerTitle}
            </p>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-cream-200/75">{t.govtLinks.disclaimerBody}</p>
            {t.govtLinks.disclaimerHi && (
              <p className="mt-2 text-[12px] leading-relaxed text-olive-300">{t.govtLinks.disclaimerHi}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
