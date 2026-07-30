import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

/* Golden shield with white star — brand mark */
export function ShieldLogo({ size = 40, ...props }: P & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M24 3 41 9.5V23c0 11.2-6.9 19.4-17 22C13.9 42.4 7 34.2 7 23V9.5L24 3Z"
        fill="#FFC947"
        stroke="#12180e"
        strokeWidth="1.6"
      />
      <path
        d="M24 7.5 37 12.6V23c0 9-5.5 15.7-13 18-7.5-2.3-13-9-13-18V12.6L24 7.5Z"
        fill="none"
        stroke="#12180e"
        strokeWidth="1"
        opacity="0.35"
      />
      <path
        d="m24 12 2.7 5.9 6.4.8-4.7 4.4 1.2 6.3L24 26.3l-5.6 3.1 1.2-6.3-4.7-4.4 6.4-.8L24 12Z"
        fill="#f4f6f3"
        stroke="#12180e"
        strokeWidth="0.8"
      />
      <path d="M15 36h18" stroke="#12180e" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export const IconChevron = (p: P) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const IconChevrons = (p: P) => (
  <svg {...base(p)}><path d="m7 6 6 6-6 6" /><path d="m13 6 6 6-6 6" /></svg>
);
export const IconArrowRight = (p: P) => (
  <svg {...base(p)}><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></svg>
);
export const IconSwap = (p: P) => (
  <svg {...base(p)}><path d="M7 4 3 8l4 4" /><path d="M3 8h13" /><path d="m17 12 4 4-4 4" /><path d="M21 16H8" /></svg>
);
export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const IconMail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IconPin = (p: P) => (
  <svg {...base(p)}><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
);
export const IconClock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></svg>
);
export const IconDownload = (p: P) => (
  <svg {...base(p)}><path d="M12 4v11" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></svg>
);
export const IconCamera = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.5" r="3.6" />
  </svg>
);
export const IconUpload = (p: P) => (
  <svg {...base(p)}><path d="M12 15V4" /><path d="m7 8 5-5 5 5" /><path d="M5 20h14" /></svg>
);
export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8.5 13.4 11l2.6 1-2.6 1L12 15.5 10.6 13 8 12l2.6-1L12 8.5Z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconFile = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" />
  </svg>
);
export const IconUsers = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" /><path d="M3.5 20c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2" />
    <circle cx="17" cy="9" r="2.4" /><path d="M15.6 14.6c2.4.2 4.3 1.9 4.9 4.9" />
  </svg>
);
export const IconCap = (p: P) => (
  <svg {...base(p)}><path d="m12 4 10 5-10 5L2 9l10-5Z" /><path d="M6.5 11.5v4.6c0 1.4 2.5 2.9 5.5 2.9s5.5-1.5 5.5-2.9v-4.6" /><path d="M22 9v5" /></svg>
);
export const IconBriefcase = (p: P) => (
  <svg {...base(p)}><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" /><path d="M3 13h18" /></svg>
);
export const IconTarget = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const IconStar = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3 2.6 5.7 6.2.7-4.6 4.3 1.2 6.1L12 16.7l-5.4 3.1 1.2-6.1L3.2 9.4l6.2-.7L12 3Z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconMenu = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconX = (p: P) => (
  <svg {...base(p)}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const IconMedal = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="14.5" r="5.5" />
    <path d="m9.5 10 -3.5-6h4L12 7l2-3h4l-3.5 6" />
    <path d="m12 12.4 1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3 1-2Z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconRadar = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" />
    <path d="M12 12 18.5 6" /><circle cx="15" cy="15" r="1" fill="currentColor" />
  </svg>
);
export const IconFlag = (p: P) => (
  <svg {...base(p)}><path d="M5 21V4" /><path d="M5 4h13l-2.5 3.5L18 11H5" /></svg>
);
export const IconShield = (p: P) => (
  <svg {...base(p)}><path d="M12 3 20 6v6c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10V6l8-3Z" /></svg>
);
export const IconExternal = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 4h6v6" /><path d="m20 4-8.5 8.5" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);
export const IconRupee = (p: P) => (
  <svg {...base(p)}><path d="M6 4h12M6 8.5h12M6 4c6 0 8 1.5 8 4.5S11 13 6 13l7 7" /></svg>
);
