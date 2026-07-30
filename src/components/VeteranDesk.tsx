import { useLang } from '../i18n';
import Reveal from './Reveal';
import { IconStar, IconMedal, IconPhone, IconMail, IconPin, IconCheck, IconShield } from './icons';

const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`;

/* Veteran Service Desk — founder profile, personal message and direct contact. */
export default function VeteranDesk() {
  const { t } = useLang();

  return (
    <section id="veteran" className="camo-dark relative scroll-mt-24 overflow-hidden">
      <div className="noise-overlay" />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #ffc947 0 1px, transparent 1px 30px)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-gold-400">
              <IconStar width={12} height={12} />
              {t.veteran.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold uppercase text-cream-50 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
              {t.veteran.heading}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 border-2 border-gold-400/60 bg-camo-800/70 rounded-sm shadow-[10px_10px_0_rgba(240,180,41,0.28)] overflow-hidden">
            <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-10 p-6 sm:p-9">
              {/* Portrait */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <span className="absolute -inset-3 rounded-full border border-dashed border-gold-400/40" aria-hidden="true" />
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-gold-400 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                    <img
                      src="images/nathji.jpg"
                      alt="Rajendra Kumar Arya (Nath Ji), Ex-Serviceman and founder of Divya Seva CSC Kendra"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full bg-gold-400 text-camo-950 flex items-center justify-center border-4 border-camo-800">
                    <IconMedal width={22} height={22} />
                  </span>
                </div>

                <ul className="mt-7 space-y-2.5 w-full max-w-[240px]">
                  {t.veteran.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[12.5px] text-cream-200/85">
                      <IconCheck width={14} height={14} className="text-gold-400 shrink-0 mt-0.5" strokeWidth={2.6} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Details */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display font-bold uppercase text-cream-50 text-2xl sm:text-[1.9rem] tracking-[0.04em] leading-tight">
                    {t.veteran.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.12em] text-[10.5px] px-3 py-1.5 rounded-sm">
                    <IconShield width={12} height={12} strokeWidth={2.4} />
                    {t.veteran.badge}
                  </span>
                </div>
                <p className="mt-2 font-display uppercase tracking-[0.16em] text-[11.5px] text-gold-300">{t.veteran.role}</p>

                {/* Personal message */}
                <blockquote className="relative mt-6 border-l-4 border-gold-400 bg-camo-950/60 px-5 py-4 rounded-r-sm">
                  <span className="absolute -top-3 left-4 font-display font-bold text-4xl text-gold-400/80 leading-none select-none" aria-hidden="true">
                    &ldquo;
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-cream-100/90 pt-1">{t.veteran.message}</p>
                  {t.veteran.messageHi && (
                    <p className="mt-3 text-[13px] leading-relaxed text-olive-300">{t.veteran.messageHi}</p>
                  )}
                </blockquote>

                {/* Contact grid */}
                <div className="mt-7 grid sm:grid-cols-2 gap-4">
                  <div className="border border-olive-500/50 bg-camo-950/50 rounded-sm p-4">
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-olive-300">{t.veteran.callLabel}</p>
                    <div className="mt-2.5 space-y-2">
                      {t.footer.phones.map((num) => (
                        <a
                          key={num}
                          href={telHref(num)}
                          className="group flex items-center gap-2.5 text-[14px] font-semibold text-cream-100 hover:text-gold-300 transition-colors"
                        >
                          <IconPhone width={15} height={15} className="text-gold-400 shrink-0" />
                          <span className="tabular-nums tracking-wide">{num}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="border border-olive-500/50 bg-camo-950/50 rounded-sm p-4">
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-olive-300">{t.veteran.emailLabel}</p>
                    <a
                      href={`mailto:${t.footer.email}`}
                      className="mt-2.5 flex items-start gap-2.5 text-[13px] font-semibold text-cream-100 hover:text-gold-300 transition-colors break-all"
                    >
                      <IconMail width={15} height={15} className="text-gold-400 shrink-0 mt-0.5" />
                      {t.footer.email}
                    </a>
                    <p className="mt-3 flex items-start gap-2.5 text-[11.5px] leading-relaxed text-cream-200/70">
                      <IconPin width={14} height={14} className="text-gold-400 shrink-0 mt-0.5" />
                      {t.footer.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tricolor h-1.5" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
