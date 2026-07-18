import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  const getLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-neutral-900 text-neutral-50 shadow-sm shadow-neutral-900/10'
        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
    }`;

  return (
    <nav 
      id="navbar" 
      className="bg-white/80 backdrop-blur-md border border-neutral-200/60 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <Link 
          id="nav-logo" 
          to="/" 
          className="font-display font-bold text-lg tracking-tight text-neutral-900 hover:opacity-80 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Purv Ughareja
        </Link>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2">
        <NavLink 
          id="nav-link-home" 
          to="/" 
          className={getLinkClass}
        >
          Home
        </NavLink>
        <NavLink 
          id="nav-link-projects" 
          to="/projects" 
          className={getLinkClass}
        >
          Projects
        </NavLink>
        <NavLink 
          id="nav-link-contact" 
          to="/contact" 
          className={getLinkClass}
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
}
