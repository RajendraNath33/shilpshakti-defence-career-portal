import { useLang } from '../i18n';
import { ShieldLogo, IconPin, IconPhone, IconMail, IconClock, IconChevron, IconFlag } from './icons';

/* Footer — quick links, services, contact and patriotic closing strip. */
export default function Footer() {
  const { t } = useLang();

  const quickLinks = [
    { href: '#top', label: t.nav.latestJobs },
    { href: '#cv', label: t.nav.cvBuilder },
    { href: '#photo', label: t.nav.photoStudio },
    { href: '#csc', label: t.nav.cscAssist },
    { href: '#govt-links', label: t.nav.govtLinks },
  ];

  return (
    <footer className="camo-dark relative">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <a href="#top" className="flex items-center gap-3">
              <ShieldLogo size={46} />
              <span className="leading-none">
                <span className="block font-display font-bold text-cream-50 text-xl uppercase tracking-[0.06em]">
                  ShilpShakti
                </span>
                <span className="block font-display text-gold-400 text-[10.5px] uppercase tracking-[0.28em] mt-1">
                  {t.nav.portalTag}
                </span>
              </span>
            </a>
            <p className="mt-5 text-[13px] leading-relaxed text-cream-200/75 max-w-xs">{t.footer.about}</p>
            <p className="mt-5 inline-flex items-center gap-2 font-display font-semibold uppercase tracking-[0.2em] text-[11.5px] text-gold-300 border border-gold-400/40 px-3 py-2 rounded-sm">
              <IconFlag width={14} height={14} />
              {t.footer.jaiHind}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h3 className="font-display font-semibold uppercase tracking-[0.18em] text-gold-400 text-[12.5px]">
              {t.footer.quickTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[13.5px] text-cream-200/80 hover:text-gold-300 transition-colors"
                  >
                    <IconChevron width={13} height={13} className="text-olive-400 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold uppercase tracking-[0.18em] text-gold-400 text-[12.5px]">
              {t.footer.servicesTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {t.footer.servicesList.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-[13px] text-cream-200/80">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-gold-400 rotate-45 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold uppercase tracking-[0.18em] text-gold-400 text-[12.5px]">
              {t.footer.contactTitle}
            </h3>
            <ul className="mt-5 space-y-4 text-[13px] text-cream-200/85">
              <li className="flex items-start gap-3">
                <IconPin width={16} height={16} className="text-gold-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t.footer.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <IconPhone width={16} height={16} className="text-gold-400 shrink-0 mt-1" />
                <span className="flex flex-col gap-1.5">
                  {t.footer.phones.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num.replace(/[^\d+]/g, '')}`}
                      className="tabular-nums tracking-wide hover:text-gold-300 transition-colors"
                    >
                      {num}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <IconMail width={16} height={16} className="text-gold-400 shrink-0 mt-0.5" />
                <a href={`mailto:${t.footer.email}`} className="hover:text-gold-300 transition-colors break-all">
                  {t.footer.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IconClock width={16} height={16} className="text-gold-400 shrink-0" />
                {t.footer.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-camo-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-olive-300">
          <p>{t.footer.rights}</p>
          <p className="text-cream-200/60">{t.footer.disclaimer}</p>
        </div>
      </div>

      {/* Tricolor closing strip */}
      <div className="tricolor h-2" aria-hidden="true" />
    </footer>
  );
}
