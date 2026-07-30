import type { Dict, Lang } from '../i18n';
import { findForce, findRank, findTrade } from '../data/forces';
import type { CvTemplate } from '../data/forces';

export interface CvInput {
  name: string;
  phone: string;
  forceId: string;
  rankId: string;
  tradeId: string;
  years: string;
  city: string;
  template: CvTemplate;
}

export interface CorporateProfile {
  input: CvInput;
  forceEn: string;
  forceHi: string;
  forceLabel: string;
  rankEn: string;
  rankHi: string;
  tradeEn: string;
  tradeHi: string;
  rankLabel: string;
  tradeLabel: string;
  corporateTitle: string;
  domain: string;
  skills: string[];
  summary: string;
  template: CvTemplate;
}

/* Converts a service record from any force into an HR-friendly profile.
   Corporate title = trade domain + rank-derived seniority suffix, e.g.
   Subedar + Signals -> "Telecom & Network Operations Manager". */
export function buildProfile(dict: Dict, lang: Lang, input: CvInput): CorporateProfile {
  const force = findForce(input.forceId);
  const rank = findRank(force, input.rankId);
  const trade = findTrade(force, input.tradeId);

  const years = input.years.trim() || '10+';
  const summary = dict.summaries[lang](input.name, years, force.short, trade.en, trade.domain, input.city.trim());

  return {
    input,
    forceEn: force.en,
    forceHi: force.hi,
    forceLabel: lang === 'en' ? force.en : `${force.hi}`,
    rankEn: rank.en,
    rankHi: rank.hi,
    tradeEn: trade.en,
    tradeHi: trade.hi,
    rankLabel: lang === 'en' ? rank.en : `${rank.hi} (${rank.en})`,
    tradeLabel: lang === 'en' ? trade.en : `${trade.hi} (${trade.en})`,
    corporateTitle: `${trade.domain} ${rank.suffix}`,
    domain: trade.domain,
    skills: trade.skills,
    summary,
    template: input.template,
  };
}
