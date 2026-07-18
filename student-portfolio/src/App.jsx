import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

const contactEmail = '24it025@charusat.edu.in'

function App() {
  // useState for dark/light mode toggle (supplementary requirement)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <BrowserRouter>
      {/* Apply theme class to root wrapper so every child inherits it */}
      <div className={`app-shell ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <NavBar darkMode={darkMode} onToggleTheme={() => setDarkMode(prev => !prev)} />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            {/* 404 catch-all route (supplementary requirement) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer email={contactEmail} year={2026} />
      </div>
    </BrowserRouter>
  )
}

export default App
