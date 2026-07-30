import { useEffect, useState } from 'react';

const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/#*+';
const DEVANAGARI = 'अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह';

/* Detects whether a string is predominantly Devanagari so the
   scramble effect uses a matching glyph set. */
function isDevanagari(text: string): boolean {
  const dev = text.match(/[\u0900-\u097F]/g);
  return !!dev && dev.length >= text.replace(/\s/g, '').length * 0.3;
}

/* Signature "decode" effect: text materialises from scrambled glyphs. */
export function useScramble(text: string): string {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }
    const charset = isDevanagari(text) ? DEVANAGARI : LATIN;
    const totalFrames = Math.min(70, Math.max(26, text.length * 2.4));
    let frame = 0;
    let raf = 0;

    const tick = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * text.length);
      let next = '';
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        if (ch === ' ' || ch === ':' || i < revealed) next += ch;
        else next += charset[Math.floor(Math.random() * charset.length)];
      }
      setOut(next);
      if (frame < totalFrames) raf = requestAnimationFrame(tick);
      else setOut(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return out;
}
