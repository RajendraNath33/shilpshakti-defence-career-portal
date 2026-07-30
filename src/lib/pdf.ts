import { jsPDF } from 'jspdf';
import type { CorporateProfile } from './cvEngine';

type RGB = [number, number, number];

const CAMO: RGB = [27, 36, 22];
const OLIVE: RGB = [58, 75, 50];
const GOLD: RGB = [255, 201, 71];
const INK: RGB = [22, 27, 17];
const GRAY: RGB = [110, 118, 104];
const CREAM: RGB = [244, 246, 243];
const BAND: RGB = [233, 237, 228];

const W = 210;
const H = 297;
const M = 16;

interface Ctx {
  doc: jsPDF;
  p: CorporateProfile;
}

const serviceRows = (p: CorporateProfile): [string, string][] => [
  ['Force / Service', `${p.forceEn}`],
  ['Rank', `${p.rankEn} (${p.rankHi})`],
  ['Corps / Trade', `${p.tradeEn} (${p.tradeHi})`],
  ['Years of Service', `${p.input.years || '10+'} years`],
  ['Last Posting', p.input.city || '—'],
  ['Transition Support', 'ZSB / DGR aligned — Divya Seva CSC Kendra, Haldwani'],
];

const contactLine = (p: CorporateProfile) =>
  [`+91 ${p.input.phone}`, p.input.city || 'Haldwani, Uttarakhand', 'via Divya Seva CSC Kendra'].join('   •   ');

/* Shared footer strip across all templates. */
function drawFooter(doc: jsPDF, accent: RGB) {
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.6);
  doc.line(M, 283, W - M, 283);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text('Generated via ShilpShakti Defence & Career Portal • cv.shilpshakti.org.in', M, 289);
  doc.text('Divya Seva CSC Kendra, Haldwani — 263139', W - M, 289, { align: 'right' });
}

/* ---------------- Template 1: Modern Corporate ---------------- */
function renderModern({ doc, p }: Ctx) {
  doc.setFillColor(...CAMO);
  doc.rect(0, 0, W, 42, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, 42, W, 1.4, 'F');

  doc.setFillColor(...GOLD);
  doc.circle(196.5, 12, 6.5, 'F');
  doc.setTextColor(...CAMO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SS', 196.5, 13.4, { align: 'center' });

  doc.setTextColor(...CREAM);
  doc.setFontSize(21);
  doc.text(p.input.name.toUpperCase(), M, 18);
  doc.setTextColor(...GOLD);
  doc.setFontSize(11.5);
  doc.text(p.corporateTitle, M, 26);
  doc.setTextColor(...CREAM);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(contactLine(p), M, 33);
  doc.setTextColor(255, 216, 115);
  doc.setFontSize(7.5);
  doc.text('SHILPSHAKTI DEFENCE & CAREER PORTAL', 196.5, 37, { align: 'right' });

  let y = 54;
  const section = (label: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GOLD);
    doc.text(label.toUpperCase(), M, y);
    doc.setDrawColor(...OLIVE);
    doc.setLineWidth(0.4);
    doc.line(M, y + 2, W - M, y + 2);
    y += 9;
  };

  section('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  const lines = doc.splitTextToSize(p.summary, W - M * 2);
  doc.text(lines, M, y);
  y += lines.length * 5 + 6;

  section('Core Competencies');
  doc.setFontSize(9.5);
  const colW = (W - M * 2) / 2;
  p.skills.forEach((skill, i) => {
    const bx = M + (i % 2) * colW;
    const by = y + Math.floor(i / 2) * 6.4;
    doc.setFillColor(...GOLD);
    doc.rect(bx, by - 2.4, 2, 2, 'F');
    doc.setTextColor(...INK);
    doc.text(skill, bx + 4.5, by);
  });
  y += Math.ceil(p.skills.length / 2) * 6.4 + 8;

  section('Service Record');
  serviceRows(p).forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...BAND);
      doc.rect(M, y - 4.6, W - M * 2, 6.8, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...OLIVE);
    doc.text(row[0], M + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...INK);
    doc.text(row[1], M + 52, y);
    y += 6.8;
  });
  y += 8;

  section('Education & Certifications');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...GRAY);
  doc.text('12th / Graduation and trade certifications — to be appended at the Kendra counter.', M, y);

  drawFooter(doc, GOLD);
}

/* ---------------- Template 2: Classic Executive ---------------- */
function renderClassic({ doc, p }: Ctx) {
  doc.setTextColor(...INK);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text(p.input.name.toUpperCase(), W / 2, 26, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(...OLIVE);
  doc.text(p.corporateTitle, W / 2, 34, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...GRAY);
  doc.text(contactLine(p), W / 2, 41, { align: 'center' });

  doc.setDrawColor(...INK);
  doc.setLineWidth(0.8);
  doc.line(M, 46, W - M, 46);
  doc.setLineWidth(0.3);
  doc.line(M, 47.6, W - M, 47.6);

  let y = 60;
  const section = (label: string) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(label.toUpperCase(), W / 2, y, { align: 'center' });
    doc.setDrawColor(...GRAY);
    doc.setLineWidth(0.25);
    doc.line(M + 28, y + 2.2, W - M - 28, y + 2.2);
    y += 10;
  };

  section('Professional Profile');
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  const lines = doc.splitTextToSize(p.summary, W - M * 2 - 8);
  doc.text(lines, M + 4, y, { align: 'justify', maxWidth: W - M * 2 - 8 });
  y += lines.length * 5.4 + 8;

  section('Core Competencies');
  doc.setFontSize(10.5);
  p.skills.forEach((skill, i) => {
    const bx = M + 6 + (i % 2) * ((W - M * 2) / 2);
    const by = y + Math.floor(i / 2) * 6.6;
    doc.setTextColor(...OLIVE);
    doc.text('•', bx, by);
    doc.setTextColor(...INK);
    doc.text(skill, bx + 4, by);
  });
  y += Math.ceil(p.skills.length / 2) * 6.6 + 9;

  section('Record of Service');
  doc.setFontSize(10.5);
  serviceRows(p).forEach((row) => {
    doc.setFont('times', 'bold');
    doc.setTextColor(...OLIVE);
    doc.text(`${row[0]}:`, M + 6, y);
    doc.setFont('times', 'normal');
    doc.setTextColor(...INK);
    doc.text(row[1], M + 58, y);
    y += 6.8;
  });
  y += 6;

  section('Education & Certifications');
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text('12th / Graduation and trade certifications — to be appended at the Kendra counter.', W / 2, y, {
    align: 'center',
  });

  drawFooter(doc, INK);
}

/* ---------------- Template 3: Tactical Clean ---------------- */
function renderTactical({ doc, p }: Ctx) {
  const SIDE = 66;

  // Sidebar
  doc.setFillColor(...CAMO);
  doc.rect(0, 0, SIDE, H, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(SIDE, 0, 1.6, H, 'F');

  doc.setFillColor(...GOLD);
  doc.circle(SIDE / 2, 26, 11, 'F');
  doc.setTextColor(...CAMO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('SS', SIDE / 2, 28.6, { align: 'center' });

  let sy = 50;
  const sideHeading = (label: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text(label.toUpperCase(), 8, sy);
    doc.setDrawColor(90, 108, 78);
    doc.setLineWidth(0.3);
    doc.line(8, sy + 1.8, SIDE - 8, sy + 1.8);
    sy += 7;
  };

  sideHeading('Contact');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...CREAM);
  doc.text(`+91 ${p.input.phone}`, 8, sy);
  sy += 5;
  doc.text(doc.splitTextToSize(p.input.city || 'Haldwani, Uttarakhand', SIDE - 16), 8, sy);
  sy += 10;

  sideHeading('Service');
  doc.setFontSize(8.5);
  [
    ['Force', p.forceEn],
    ['Rank', p.rankEn],
    ['Trade', p.tradeEn],
    ['Tenure', `${p.input.years || '10+'} years`],
  ].forEach(([k, v]) => {
    doc.setTextColor(150, 168, 132);
    doc.text(String(k).toUpperCase(), 8, sy);
    sy += 4.2;
    doc.setTextColor(...CREAM);
    const vl = doc.splitTextToSize(String(v), SIDE - 16);
    doc.text(vl, 8, sy);
    sy += vl.length * 4.2 + 3.5;
  });

  sy += 3;
  sideHeading('Competencies');
  doc.setFontSize(8.5);
  p.skills.forEach((skill) => {
    const sl = doc.splitTextToSize(skill, SIDE - 18);
    doc.setFillColor(...GOLD);
    doc.rect(8, sy - 2, 1.6, 1.6, 'F');
    doc.setTextColor(...CREAM);
    doc.text(sl, 12, sy);
    sy += sl.length * 4.2 + 2.6;
  });

  sideHeading('Verification');
  doc.setFontSize(7.5);
  doc.setTextColor(150, 168, 132);
  doc.text(doc.splitTextToSize('ZSB / DGR aligned. Documents verified at Divya Seva CSC Kendra, Haldwani.', SIDE - 16), 8, sy);

  // Main column
  const MX = SIDE + 12;
  const MW = W - MX - M;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text(doc.splitTextToSize(p.input.name.toUpperCase(), MW), MX, 26);

  doc.setFontSize(10.5);
  doc.setTextColor(...OLIVE);
  doc.text(doc.splitTextToSize(p.corporateTitle, MW), MX, 35);

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.2);
  doc.line(MX, 42, MX + 26, 42);

  let y = 56;
  const mainHeading = (label: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(label.toUpperCase(), MX, y);
    doc.setDrawColor(200, 208, 192);
    doc.setLineWidth(0.3);
    doc.line(MX, y + 2, W - M, y + 2);
    y += 8.5;
  };

  mainHeading('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  const lines = doc.splitTextToSize(p.summary, MW);
  doc.text(lines, MX, y);
  y += lines.length * 4.9 + 8;

  mainHeading('Target Domain');
  doc.setFontSize(9.5);
  doc.setTextColor(...OLIVE);
  doc.text(p.domain, MX, y);
  y += 11;

  mainHeading('Service Record');
  doc.setFontSize(9);
  serviceRows(p).forEach((row) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...OLIVE);
    doc.text(row[0], MX, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...INK);
    const rv = doc.splitTextToSize(row[1], MW - 42);
    doc.text(rv, MX + 42, y);
    y += Math.max(rv.length * 4.6, 6.2);
  });
  y += 6;

  mainHeading('Education & Certifications');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(doc.splitTextToSize('12th / Graduation and trade certifications — to be appended at the Kendra counter.', MW), MX, y);

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(MX, 283, W - M, 283);
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text('ShilpShakti Defence & Career Portal • Divya Seva CSC Kendra, Haldwani — 263139', MX, 289);
}

/* Renders the translated corporate profile as an A4 PDF in the chosen template. */
export function generateCvPdf(profile: CorporateProfile): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const ctx: Ctx = { doc, p: profile };

  if (profile.template === 'classic') renderClassic(ctx);
  else if (profile.template === 'tactical') renderTactical(ctx);
  else renderModern(ctx);

  const safeName = profile.input.name.trim().replace(/\s+/g, '-').toLowerCase() || 'ex-serviceman';
  doc.save(`${safeName}-cv-${profile.template}-shilpshakti.pdf`);
}
