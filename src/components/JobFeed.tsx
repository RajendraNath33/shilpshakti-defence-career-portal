import { useState } from 'react';
import { useLang } from '../i18n';
import Reveal from './Reveal';
import { IconPin, IconClock, IconBriefcase, IconArrowRight, IconStar } from './icons';

type Cat = 'all' | 'esm' | 'youth' | 'govt';

/* Dual job & career feed with colour-coded category badges and filters. */
export default function JobFeed() {
  const { t } = useLang();
  const [cat, setCat] = useState<Cat>('all');

  const jobs = t.jobs.jobs;
  const filtered = cat === 'all' ? jobs : jobs.filter((j) => j.cat === cat);

  const tabs: { id: Cat; label: string; count: number }[] = [
    { id: 'all', label: t.jobs.filters.all, count: jobs.length },
    { id: 'esm', label: t.jobs.filters.esm, count: jobs.filter((j) => j.cat === 'esm').length },
    { id: 'youth', label: t.jobs.filters.youth, count: jobs.filter((j) => j.cat === 'youth').length },
    { id: 'govt', label: t.jobs.filters.govt, count: jobs.filter((j) => j.cat === 'govt').length },
  ];

  const badgeStyle: Record<Exclude<Cat, 'all'>, string> = {
    esm: 'bg-gold-400 text-camo-950',
    youth: 'bg-olive-600 text-cream-100',
    govt: 'bg-cream-200 text-camo-800 border border-dashed border-olive-500/70',
  };

  return (
    <section id="jobs" className="camo-light relative scroll-mt-24 text-ink-900">
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        {/* Section head */}
        <Reveal>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-[0.24em] text-[11px] text-olive-600">
              <IconStar width={12} height={12} className="text-gold-600" />
              {t.jobs.eyebrow}
            </p>
            <h2 className="mt-3 font-display font-bold uppercase text-camo-900 text-3xl sm:text-4xl xl:text-[2.8rem] leading-tight">
              {t.jobs.heading}
            </h2>
            <p className="mt-4 text-olive-600 text-[15px] leading-relaxed">{t.jobs.sub}</p>
          </div>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={120}>
          <div className="mt-9 flex flex-wrap gap-2.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCat(tab.id)}
                aria-pressed={cat === tab.id}
                className={`inline-flex items-center gap-2 font-display uppercase tracking-[0.1em] text-[12.5px] px-4 py-2.5 rounded-sm border transition-all duration-200 ${
                  cat === tab.id
                    ? 'bg-camo-900 text-gold-300 border-camo-900 shadow-[3px_3px_0_rgba(58,75,50,0.9)] -translate-y-0.5'
                    : 'bg-cream-50 text-camo-800 border-olive-500/40 hover:border-camo-900 hover:-translate-y-0.5'
                }`}
              >
                {tab.label}
                <span
                  className={`font-mono text-[10.5px] px-1.5 py-0.5 rounded-sm ${
                    cat === tab.id ? 'bg-gold-400 text-camo-950' : 'bg-cream-200 text-olive-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Job grid */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((job, i) => (
            <Reveal key={job.title} delay={(i % 3) * 90}>
              <article className="group h-full flex flex-col bg-cream-50 border border-olive-500/30 rounded-sm p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0_rgba(27,36,22,0.85)] hover:border-camo-900">
                {/* Badge row */}
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-block font-display font-semibold uppercase tracking-[0.12em] text-[10.5px] px-2.5 py-1.5 rounded-sm ${badgeStyle[job.cat]}`}
                  >
                    {t.jobs.badges[job.cat]}
                  </span>
                  {job.isNew && (
                    <span className="relative inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-brick-500 tracking-widest">
                      <span className="relative w-1.5 h-1.5 rounded-full bg-brick-500 pulse-dot" />
                      {t.jobs.newTag}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display font-semibold text-camo-900 text-[1.35rem] leading-snug uppercase tracking-wide">
                  {job.title}
                </h3>
                <p className="mt-1 text-[13px] text-olive-600 font-medium">{job.org}</p>

                {/* Meta */}
                <ul className="mt-4 space-y-2 text-[12.5px] text-camo-700">
                  <li className="flex items-center gap-2.5">
                    <IconPin width={14} height={14} className="text-olive-500 shrink-0" />
                    {job.location}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IconClock width={14} height={14} className="text-olive-500 shrink-0" />
                    {t.jobs.deadline}: <strong className="text-camo-900">{job.deadline}</strong>
                    <span
                      className={`ml-auto font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-sm ${
                        job.days <= 15 ? 'bg-brick-500/15 text-brick-500' : 'bg-olive-600/12 text-olive-600'
                      }`}
                    >
                      {job.days} {t.jobs.daysLeft}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IconBriefcase width={14} height={14} className="text-olive-500 shrink-0" />
                    {t.jobs.vacancies}: <strong className="text-camo-900">{job.posts}</strong>
                  </li>
                </ul>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span key={tag} className="text-[10.5px] font-medium bg-cream-200 text-camo-700 border border-olive-500/25 px-2 py-1 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="#csc"
                  className="mt-5 pt-4 border-t border-dashed border-olive-500/40 inline-flex items-center justify-between font-display font-semibold uppercase tracking-[0.12em] text-[12.5px] text-camo-900 group-hover:text-gold-600 transition-colors"
                >
                  {t.jobs.apply}
                  <IconArrowRight width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={2.2} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
