import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function NavBar({ darkMode, onToggleTheme }) {
  // useState to toggle hamburger menu (UI visibility)
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 flex items-center justify-between px-10 h-16
      backdrop-blur-md border-b transition-colors duration-300
      ${darkMode
        ? 'bg-[rgba(2,6,23,0.85)] border-slate-700/40'
        : 'bg-white/80 border-slate-200'
      }`}
    >
      {/* Brand */}
      <span className={`text-xl font-bold tracking-tight select-none
        ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}
      >
        HG.
      </span>

      {/* Hamburger (mobile) */}
      <button
        id="hamburger-btn"
        className="flex flex-col gap-1.5 sm:hidden bg-transparent border-none cursor-pointer p-1"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        {[0, 1, 2].map(i => (
          <span key={i}
            className={`block w-5 h-0.5 rounded transition-all duration-300
              ${darkMode ? 'bg-slate-400' : 'bg-slate-500'}`}
          />
        ))}
      </button>

      {/* Nav links */}
      <ul className={`flex gap-2 list-none m-0 p-0
        max-sm:${menuOpen ? 'flex' : 'hidden'}
        max-sm:flex-col max-sm:absolute max-sm:top-16 max-sm:left-0 max-sm:right-0
        max-sm:py-3 max-sm:px-4 max-sm:backdrop-blur-md max-sm:border-b
        ${darkMode
          ? 'max-sm:bg-[rgba(2,6,23,0.96)] max-sm:border-slate-700/40'
          : 'max-sm:bg-white/96 max-sm:border-slate-200'
        }`}
      >
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `inline-block px-4 py-2 rounded-full text-sm font-medium no-underline transition-all duration-200
                ${isActive
                  ? darkMode
                    ? 'text-sky-300 bg-sky-300/10'
                    : 'text-sky-600 bg-sky-100'
                  : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Dark / Light toggle */}
      <button
        id="theme-toggle"
        onClick={onToggleTheme}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`text-xl px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer
          hover:scale-110 hover:rotate-12
          ${darkMode
            ? 'bg-sky-300/10 border-slate-700/40'
            : 'bg-sky-50 border-slate-200'
          }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </nav>
  )
}

export default NavBar
