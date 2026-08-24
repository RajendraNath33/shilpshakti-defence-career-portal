import { useEffect, useState } from 'react';
import type { Lang } from '../i18n';

export interface DynamicJob {
  id?: string;
  cat: 'esm' | 'youth' | 'govt';
  isNew: boolean;
  title: string;
  org: string;
  location: string;
  deadline: string;
  days: number;
  posts: string;
  tags: string[];
  link?: string;
}

interface NewsFile {
  en: DynamicJob[];
  hi: DynamicJob[];
  updatedAt?: string;
}

export function useDynamicJobs(lang: Lang): { jobs: DynamicJob[]; updatedAt: string | null } {
  const [jobs, setJobs] = useState<DynamicJob[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/news.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('news.json not reachable');
        return res.json();
      })
      .then((data: NewsFile) => {
        if (cancelled) return;
        const list = lang === 'hi' ? data.hi : data.en;
        setJobs(Array.isArray(list) ? list : []);
        setUpdatedAt(data.updatedAt || null);
      })
      .catch(() => {
        if (!cancelled) {
          setJobs([]);
          setUpdatedAt(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { jobs, updatedAt };
}
