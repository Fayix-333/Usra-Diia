import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Wings from './components/Wings';
import Gallery from './components/Gallery';
import Achievements from './components/Achievements';
import Journey from './components/Journey';
import Events from './components/Events';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PortalDashboard from './components/PortalDashboard';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <AuthProvider>
      {/* Apple-style Loader Preloader */}
      <AnimatePresence mode="wait">
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative min-h-screen bg-[#030303] text-neutral-100 overflow-x-hidden selection:bg-blue-500/30 selection:text-white flex flex-col"
        >
          {/* Custom Cursor Spotlight tracker */}
          <CustomCursor />

          {/* Frosted Glass Sticky Navbar */}
          <Navbar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenDashboard={() => setIsDashboardOpen(true)}
          />

          {/* Core Content Blocks */}
          <main className="relative z-20 flex-grow pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }}
                className="w-full"
              >
                {activeSection === 'home' && (
                  <>
                    <Hero 
                      onExploreClick={() => {
                        setActiveSection('about');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }} 
                      onJoinClick={() => {
                        setActiveSection('contact');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      onLoginClick={() => setIsAuthModalOpen(true)}
                    />
                    <Achievements />
                  </>
                )}
                {activeSection === 'about' && <About />}
                {activeSection === 'wings' && <Wings />}
                {activeSection === 'gallery' && <Gallery />}
                {activeSection === 'journey' && <Journey />}
                {activeSection === 'events' && <Events />}
                {activeSection === 'team' && <Team />}
                {activeSection === 'contact' && <Contact />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Modals & Portals */}
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />

          <PortalDashboard
            isOpen={isDashboardOpen}
            onClose={() => setIsDashboardOpen(false)}
          />

          {/* Premium Glass footer */}
          <Footer onNavClick={(section) => {
            setActiveSection(section);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }} />
        </motion.div>
      )}
    </AuthProvider>
  );
}
