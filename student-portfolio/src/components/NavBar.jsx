import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function NavBar({ darkMode, onToggleTheme }) {
  // useState to toggle hamburger menu visibility
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="navbar">
      <span className="navbar-brand">HG.</span>

      {/* Hamburger for mobile */}
      <button
        className="nav-hamburger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
      </button>

      <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' nav-link--active' : '')
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Dark / Light mode toggle (supplementary requirement) */}
      <button
        id="theme-toggle"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Light mode' : 'Dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </nav>
  )
}

export default NavBar
