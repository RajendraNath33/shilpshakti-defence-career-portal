import React, { useState } from 'react';
import { useLang } from '../i18n';
import { Loader2, Plus, Trash2, Download, RefreshCw, Presentation } from 'lucide-react';

interface Slide {
  title: string;
  bullets: string[];
}

export const PPTGeneratorPage: React.FC = () => {
  const { t } = useLang();
  const [topic, setTopic] = useState('');
  const [numSlides, setNumSlides] = useState(5);
  const [theme, setTheme] = useState('gaia');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isOutlining, setIsOutlining] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError(t.ppt.errors.topic);
      return;
    }
    setError(null);
    setIsOutlining(true);

    try {
      const res = await fetch('https://career.shilpshakti.org.in/api/outline-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: topic, num_slides: Number(numSlides) }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setSlides(data.slides || []);
    } catch {
      setError(t.ppt.errors.outlineFailed);
    } finally {
      setIsOutlining(false);
    }
  };

  const handleTitleChange = (index: number, val: string) => {
    const updated = [...slides];
    updated[index].title = val;
    setSlides(updated);
  };

  const handleBulletChange = (sIndex: number, bIndex: number, val: string) => {
    const updated = [...slides];
    updated[sIndex].bullets[bIndex] = val;
    setSlides(updated);
  };

  const handleAddBullet = (sIndex: number) => {
    const updated = [...slides];
    updated[sIndex].bullets.push('');
    setSlides(updated);
  };

  const handleRemoveBullet = (sIndex: number, bIndex: number) => {
    const updated = [...slides];
    updated[sIndex].bullets.splice(bIndex, 1);
    setSlides(updated);
  };

  const handleAddSlide = () => {
    setSlides([...slides, { title: 'New Slide', bullets: [''] }]);
  };

  const handleRemoveSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleDownloadPPT = async () => {
    setError(null);
    setIsRendering(true);

    try {
      const res = await fetch('https://career.shilpshakti.org.in/api/render-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, theme }),
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presentation_${Date.now()}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError(t.ppt.errors.renderFailed);
    } finally {
      setIsRendering(false);
    }
  };

  const handleStartOver = () => {
    setSlides([]);
    setTopic('');
    setError(null);
  };

  return (
    <div id="ppt" className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            {t.ppt.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center gap-3">
            <Presentation className="text-amber-400" /> {t.ppt.heading}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            {t.ppt.sub}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Input Form */}
        {slides.length === 0 ? (
          <form onSubmit={handleGenerateOutline} className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 space-y-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-200">{t.ppt.formTitle}</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">{t.ppt.topicLabel}</label>
              <textarea
                rows={4}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.ppt.topicPh}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t.ppt.slidesLabel}</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={numSlides}
                  onChange={(e) => setNumSlides(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t.ppt.themeLabel}</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 text-sm"
                >
                  <option value="gaia">{t.ppt.themes.gaia}</option>
                  <option value="uncover">{t.ppt.themes.uncover}</option>
                  <option value="default">{t.ppt.themes.default}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isOutlining}
              className="w-full py-3 px-4 rounded-lg font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isOutlining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> {t.ppt.generatingOutline}
                </>
              ) : (
                t.ppt.generateOutlineBtn
              )}
            </button>
          </form>
        ) : (
          /* Outline & Editor */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <div>
                <h2 className="text-lg font-semibold">{t.ppt.outlineTitle}</h2>
                <p className="text-xs text-slate-400">Total slides: {slides.length}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartOver}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-600 hover:bg-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {t.ppt.startOverBtn}
                </button>
                <button
                  onClick={handleDownloadPPT}
                  disabled={isRendering}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isRendering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> {t.ppt.downloading}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> {t.ppt.downloadBtn}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {slides.map((slide, sIdx) => (
                <div key={sIdx} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                    <span className="text-xs font-semibold text-amber-400">Slide {sIdx + 1}</span>
                    <button
                      onClick={() => handleRemoveSlide(sIdx)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {t.ppt.removeSlide}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">{t.ppt.slideTitleLabel}</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleTitleChange(sIdx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm font-semibold text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">{t.ppt.bulletLabel}s</label>
                    {slide.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleBulletChange(sIdx, bIdx, e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handleRemoveBullet(sIdx, bIdx)}
                          className="p-2 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddBullet(sIdx)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.ppt.addBullet}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddSlide}
              className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> {t.ppt.addSlide}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PPTGeneratorPage;
