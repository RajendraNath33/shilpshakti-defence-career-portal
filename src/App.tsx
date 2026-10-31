import { useState } from 'react';
import { LanguageProvider } from './i18n';
import TickerBar from './components/TickerBar';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsBand from './components/StatsBand';
import JobFeed from './components/JobFeed';
import GovtLinks from './components/GovtLinks';
import ProcessSteps from './components/ProcessSteps';
import CVBuilder from './components/CVBuilder';
import PhotoStudio from './components/PhotoStudio';
import Testimonials from './components/Testimonials';
import CSCForm from './components/CSCForm';
import VeteranDesk from './components/VeteranDesk';
import Footer from './components/Footer';
import PPTGeneratorPage from './components/PPTGenerator';

type Page = 'home' | 'ppt-generator';

/* ShilpShakti Defence & Career Portal — cv.shilpshakti.org.in
   Managed by Divya Seva CSC Kendra, Haldwani. */
export default function App() {
  const [page, setPage] = useState<Page>('home');

  const goHome = () => {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const openPptGenerator = () => {
    setPage('ppt-generator');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-camo-900 font-body">
        <TickerBar />
        <Header onOpenPptGenerator={openPptGenerator} onLogoClick={goHome} />
        {page === 'home' ? (
          <main>
            <Hero />
            <StatsBand />
            <JobFeed />
            <GovtLinks />
            <ProcessSteps />
            <CVBuilder />
            <PhotoStudio />
            <Testimonials />
            <CSCForm />
            <VeteranDesk />
          </main>
        ) : (
          <main>
            <PPTGeneratorPage />
          </main>
        )}
        <Footer />
      </div>
    </LanguageProvider>
  );
}