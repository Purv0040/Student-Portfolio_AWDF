import React from 'react';
import { FiLoader, FiCpu } from 'react-icons/fi';

const LoadingFallback = ({ message = 'Loading component chunk...' }) => {
  return (
    <div className="lazy-fallback-wrapper">
      <div className="glass-panel lazy-fallback-card">
        <div className="lazy-spinner-ring">
          <FiLoader className="spinning-icon" size={36} />
        </div>
        <div className="lazy-text-content">
          <div className="lazy-badge">
            <FiCpu size={14} />
            <span>React.lazy() &amp; Suspense</span>
          </div>
          <h3>{message}</h3>
          <p className="lazy-subtext">Fetching and evaluating route JavaScript chunk on demand...</p>
        </div>
        
        {/* Skeleton placeholder bars for smooth visual transition */}
        <div className="skeleton-container">
          <div className="skeleton-bar skeleton-title"></div>
          <div className="skeleton-bar skeleton-body"></div>
          <div className="skeleton-bar skeleton-subtitle"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
