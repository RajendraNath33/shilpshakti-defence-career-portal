import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import type { Lang } from '../i18n';
import { ShieldLogo, IconMenu, IconX, IconChevron, IconPhone } from './icons';
import GoogleLoginButton from './GoogleLogin';

/* Sticky header: brand, nav, EN|HI toggle, Get Started CTA and mobile drawer. */
export default function Header({
  onOpenPptGenerator,
  onLogoClick,
}: {
  onOpenPptGenerator: () => void;
  onLogoClick: () => void;
}) {
  const { t, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll and allow Escape to dismiss the drawer. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const links = [
    { href: '#jobs', label: t.nav.latestJobs },
    { href: '#cv', label: t.nav.cvBuilder },
    { href: '#photo', label: t.nav.photoStudio },
    { href: '#csc', label: t.nav.cscAssist },
    { href: '#ppt', label: t.nav.pptGenerator },
    { href: '#govt-links', label: t.nav.govtLinks },
  ];

  const toggleLang = (l: Lang) => setLang(l);

  return (
    <>
      <header
        className={`sticky top-0 z-40 camo-dark border-b transition-shadow duration-300 ${
          scrolled ? 'border-gold-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.45)]' : 'border-camo-700'
        }`}
      >
        <div className="noise-overlay" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4 h-[68px]">
            {/* Brand */}
            
            <a
  href="#top"
  onClick={(e) => {
    e.preventDefault();
    onLogoClick();
  }}
  className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
>
              <ShieldLogo
                size={40}
                className="drop-shadow-[0_2px_6px_rgba(255,201,71,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="leading-none">
                <span className="block font-display font-bold text-cream-50 text-base sm:text-xl tracking-[0.06em] uppercase">
                  ShilpShakti
                </span>
                <span className="block font-display text-gold-400 text-[9px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.28em] mt-0.5">
                  {t.nav.portalTag}
                </span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    if (l.href === '#ppt') {
                      e.preventDefault();
                      onOpenPptGenerator();
                    }
                  }}
                  className="relative px-2.5 py-2 text-[13px] font-medium text-cream-200 hover:text-gold-300 transition-colors group/link whitespace-nowrap"
                >
                  {l.label}
                  <span className="absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-gold-400 scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-300" />
                </a>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language toggle */}
              <div
                className="relative flex items-center rounded-full border border-gold-400/50 bg-camo-950/70 p-1"
                role="group"
                aria-label="Language toggle"
              >
                <span
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-gold-400 transition-transform duration-300 ease-out ${
                    lang === 'hi' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                  aria-hidden="true"
                />
                {(['en', 'hi'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleLang(l)}
                    aria-pressed={lang === l}
                    className={`relative z-10 w-10 sm:w-12 rounded-full py-1.5 font-display text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      lang === l ? 'text-camo-950' : 'text-cream-200 hover:text-gold-300'
                    }`}
                  >
                    {l === 'en' ? 'EN' : 'हिंदी'}
                  </button>
                ))}
              </div>

              <div className="hidden sm:block">
                <GoogleLoginButton compact />
              </div>

              <a href="#cv" className="hidden md:inline-flex items-center gap-2 btn-stamp bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.1em] text-[13px] px-5 py-2.5 rounded-sm">
                {t.nav.getStarted}
                <IconChevron width={15} height={15} strokeWidth={2.4} />
              </a>

              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-sm border border-camo-600 text-cream-100 hover:text-gold-300 hover:border-gold-400/60 transition-colors"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-label="Open navigation menu"
              >
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Mobile drawer ---------- */}
      <div className={`lg:hidden fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        {/* Scrim */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-camo-950/80 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-[85%] max-w-[340px] camo-dark border-l-2 border-gold-400/60 shadow-[-16px_0_48px_rgba(0,0,0,0.55)] transition-transform duration-400 ease-out flex flex-col ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between px-5 h-[68px] border-b border-camo-700 shrink-0">
            <span className="flex items-center gap-2.5">
              <ShieldLogo size={32} />
              <span className="font-display font-bold uppercase tracking-[0.08em] text-cream-50 text-[15px]">ShilpShakti</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-olive-500/60 text-cream-200 hover:text-gold-300 hover:border-gold-400 transition-colors"
              aria-label="Close navigation menu"
            >
              <IconX width={16} height={16} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                  onClick={(e) => { if (l.href === "#ppt") { e.preventDefault(); onOpenPptGenerator(); } setMenuOpen(false); }}
                style={{ transitionDelay: menuOpen ? `${80 + i * 45}ms` : '0ms' }}
                className={`flex items-center justify-between py-3.5 border-b border-camo-800 last:border-0 text-cream-100 hover:text-gold-300 transition-all duration-300 ${
                  menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
              >
                <span className="font-display uppercase tracking-[0.12em] text-[13.5px]">{l.label}</span>
                <span className="font-mono text-[10px] text-olive-300">0{i + 1}</span>
              </a>
            ))}
          </nav>

          <div className="px-5 pb-6 pt-4 border-t border-camo-700 shrink-0 space-y-3">
            <a href="#cv" onClick={() => setMenuOpen(false)} className="w-full inline-flex justify-center items-center gap-2 btn-stamp bg-gold-400 text-camo-950 font-display font-semibold uppercase tracking-[0.1em] text-[13px] px-5 py-3 rounded-sm">
              {t.nav.getStarted}
            </a>
            <a href={`tel:${t.footer.phones[0].replace(/[^\d+]/g, '')}`} className="w-full inline-flex justify-center items-center gap-2 border-2 border-olive-400 text-cream-200 hover:border-gold-400 hover:text-gold-300 font-display font-semibold uppercase tracking-[0.08em] text-[12.5px] px-5 py-2.5 rounded-sm transition-colors">
              <IconPhone width={14} height={14} />
              {t.footer.phones[0]}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
