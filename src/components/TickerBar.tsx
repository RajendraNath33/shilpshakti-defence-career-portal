import { useLang } from '../i18n';
import { IconStar } from './icons';

/* Running news ticker — pauses on hover, static under reduced motion. */
export default function TickerBar() {
  const { t } = useLang();
  const items = t.ticker.items;

  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center text-[13px] text-cream-200">
          <span className="px-5 whitespace-nowrap">{item}</span>
          <IconStar width={11} height={11} className="text-gold-400 shrink-0" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-camo-950 border-b border-camo-700 relative z-50">
      <div className="mx-auto max-w-7xl flex items-stretch">
        <div className="flex items-center gap-2 shrink-0 bg-gold-400 text-camo-950 px-3 sm:px-4 py-1.5">
          <span className="relative w-2 h-2 rounded-full bg-camo-950 pulse-dot" />
          <span className="font-display font-semibold uppercase tracking-[0.14em] text-[11px] sm:text-xs whitespace-nowrap">
            {t.ticker.label}
          </span>
        </div>
        <div className="ticker-shell relative flex-1 overflow-hidden py-1.5">
          <div className="ticker-track items-center">
            <Row />
            <Row hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
