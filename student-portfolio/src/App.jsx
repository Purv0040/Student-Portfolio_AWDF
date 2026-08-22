import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

const contactEmail = '24it025@charusat.edu.in'

function App() {
  // useState for dark/light mode toggle
  const [darkMode, setDarkMode] = useState(true)

  return (
    <BrowserRouter>
      {/*
        Tailwind's `dark:` variant is activated by the `dark` class on a parent.
        We toggle it here on the root wrapper.
      */}
      <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300
        ${darkMode
          ? 'dark bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#111827] text-slate-200'
          : 'bg-gradient-to-b from-sky-50 via-sky-100 to-slate-50 text-slate-800'
        }`}
      >
        <NavBar darkMode={darkMode} onToggleTheme={() => setDarkMode(prev => !prev)} />
        <main className="flex-1 w-[min(960px,calc(100%-32px))] mx-auto py-10 pb-16">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact"  element={<Contact />} />
            {/* 404 catch-all */}
            <Route path="*"         element={<NotFound />} />
          </Routes>
        </main>
        <Footer email={contactEmail} year={2026} />
      </div>
    </BrowserRouter>
  )
}

export default App
