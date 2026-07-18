import { studentProfile } from '../portfolioData';

export default function Header({ name, role }) {
  return (
    <header 
      id="portfolio-header" 
      className="bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
    >
      <div className="flex flex-col gap-3">
        {/* Availability Badge */}
        {studentProfile.availableForWork && (
          <div className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Available for Internships & Projects
          </div>
        )}
        
        <div>
          <h1 
            id="header-name" 
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-neutral-950"
          >
            {name}
          </h1>
          <p 
            id="header-role" 
            className="text-neutral-500 text-sm sm:text-base mt-1 font-medium flex items-center gap-2"
          >
            <span className="text-indigo-600 font-semibold">{role}</span> Student
          </p>
        </div>

        {/* Location tag */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono mt-1">
          <svg className="w-4.5 h-4.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {studentProfile.location}
        </div>
      </div>

      {/* Profile quick stats or action button */}
      <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
        <a 
          href="#contact" 
          className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/10 active:scale-98"
        >
          Let's Connect
        </a>
        <a 
          href="/projects" 
          className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/40 active:scale-98"
        >
          View Work
        </a>
      </div>
    </header>
  );
}
