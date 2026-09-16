import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiCheckSquare, 
  FiPieChart, 
  FiMail, 
  FiUser, 
  FiLogOut,
  FiZap
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar-container glass-panel">
      <div className="navbar-brand">
        <div className="brand-logo">
          <FiZap size={22} className="brand-icon" />
          <span className="brand-name">TaskFlow</span>
        </div>
        <span className="perf-tag" title="Demonstrating route-based lazy loading">
          Split Chunks
        </span>
      </div>

      <nav className="navbar-links">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <FiCheckSquare />
          <span>Tasks</span>
        </NavLink>

        <NavLink 
          to="/analytics" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <FiPieChart />
          <span>Analytics</span>
        </NavLink>

        <NavLink 
          to="/contact" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <FiMail />
          <span>Contact</span>
        </NavLink>
      </nav>

      <div className="navbar-user">
        <div className="user-badge" title={user?.email}>
          <FiUser />
          <span>{user?.name || user?.email?.split('@')[0] || 'User'}</span>
        </div>
        <button className="btn-logout" onClick={logout} title="Sign Out">
          <FiLogOut />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
