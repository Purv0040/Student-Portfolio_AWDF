import React, { Suspense, lazy } from 'react';
import LoadingFallback from '../components/LoadingFallback';
import { FiPieChart, FiCpu, FiShield, FiTrendingUp } from 'react-icons/fi';

// Supplementary Problem: Lazy load a heavy third-party component (Chart.js)
// only when this specific page needs it!
const TaskAnalyticsChart = lazy(() => import('../components/TaskAnalyticsChart'));

const Analytics = ({ tasks = [] }) => {
  return (
    <div className="page-wrapper analytics-page">
      <div className="page-header">
        <div>
          <h2>Analytics &amp; Performance Insights</h2>
          <p className="page-subtitle">Interactive visual charts loaded via dynamic component-level lazy splitting.</p>
        </div>
        <div className="lazy-badge" style={{ alignSelf: 'flex-start' }}>
          <FiCpu size={14} />
          <span>Heavy Lib: Chart.js (Code-Split)</span>
        </div>
      </div>

      <div className="analytics-banner glass-panel">
        <div className="banner-icon">
          <FiTrendingUp size={28} />
        </div>
        <div>
          <h4>Component-Level Code Splitting Active</h4>
          <p>
            The chart visualizer below imports <code>chart.js</code> (~160 kB minified) strictly on demand using <code>React.lazy()</code>. 
            Users navigating to Tasks, Projects, or Contact routes never download this bundle!
          </p>
        </div>
      </div>

      {/* Component-level Suspense wrapper for the heavy Chart chunk */}
      <Suspense fallback={<LoadingFallback message="Loading Chart.js Engine & Analytics..." />}>
        <TaskAnalyticsChart tasks={tasks} />
      </Suspense>
    </div>
  );
};

export default Analytics;
