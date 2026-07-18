import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import { studentProfile } from './portfolioData';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-800 flex flex-col antialiased selection:bg-neutral-200 selection:text-neutral-900">
      <div className="w-full max-w-full px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 flex-grow flex flex-col gap-6 sm:gap-10">
        
        {/* Responsive Navigation Bar */}
        <NavBar />

        {/* Core App View Frame */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Sticky/Persistent Modern Footer */}
        <Footer socials={studentProfile.socials} />
      </div>
    </div>
  );
}
