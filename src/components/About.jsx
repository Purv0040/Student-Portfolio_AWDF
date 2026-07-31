import { useState } from 'react';

export default function About({ bio }) {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <section 
      id="about" 
      className="bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
    >
      <div>
        <h2 
          id="about-heading" 
          className="font-display font-bold text-xl sm:text-2xl text-neutral-900 flex items-center gap-2"
        >
          <span className="w-1 h-6 rounded bg-indigo-500"></span>
          About Me
        </h2>
        <p 
          id="about-text" 
          className="text-neutral-600 text-sm sm:text-base leading-relaxed mt-4"
        >
          {bio}
        </p>
      </div>
      
      <div>
        <button 
          id="toggle-bio-btn"
          onClick={() => setShowExtra(!showExtra)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/60 transition-all duration-300"
        >
          <span>{showExtra ? 'Hide Academic Details' : 'Show Academic Details'}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${showExtra ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {showExtra && (
        <div 
          id="extra-bio-content" 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-neutral-50/60 border border-neutral-200/40 animate-fadeIn"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono font-semibold">Education</span>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
              <strong>B.Tech in Information Technology</strong> <br />
              <span className="text-xs text-neutral-500">Charotar University of Science and Technology (CHARUSAT)</span>
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono font-semibold">Academic Focus</span>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Specialized in Object-Oriented Design, Database Management Systems, and Modern Frontend Frameworks.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
