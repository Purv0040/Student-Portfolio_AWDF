import { useState } from 'react'
import Skills from '../components/Skills.jsx'

const aboutText =
  'IT student at Charusat University, passionate about web development and software engineering. Skilled in React, JavaScript, HTML, CSS, C++, and Git. Eager to contribute to innovative projects and enhance technical expertise.'

const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'C++', 'Git']

// Reusable glass panel class string
const panel = 'rounded-3xl border border-slate-700/30 bg-[rgba(15,23,42,0.78)] backdrop-blur-lg shadow-2xl'

function Home() {
  // useState: toggle About section visibility
  const [showBio, setShowBio] = useState(true)

  return (
    <div className="grid gap-5">

      {/* ── Hero panel ── */}
      <header className={`${panel} p-10 grid gap-3`}>
        <p className="m-0 text-sky-300 text-xs uppercase tracking-[0.2em] font-semibold">
          Student Portfolio
        </p>
        <h1 className="text-slate-50" style={{ fontSize: 'clamp(2.5rem,6vw,4.8rem)', lineHeight: 0.95 }}>
          Heer Ghevariya
        </h1>
        <p className="m-0 text-slate-400 text-lg leading-relaxed max-w-[62ch]">
          A compact profile page that highlights background, skills, and contact details.
        </p>
      </header>

      {/* ── About — toggleable ── */}
      <section className={`${panel} p-9`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold text-slate-100 m-0">About Me</h2>
          <button
            onClick={() => setShowBio(prev => !prev)}
            aria-expanded={showBio}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-sky-300
              border border-sky-300/30 bg-sky-300/10 cursor-pointer
              transition-all duration-200 hover:bg-sky-300/20 hover:border-sky-300/60"
          >
            {showBio ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Animated collapsible */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out
          ${showBio ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <p className="m-0 text-slate-400 text-base leading-relaxed max-w-[62ch]">
            {aboutText}
          </p>
        </div>
      </section>

      {/* ── Skills ── */}
      <Skills heading="Core Skills" items={skills} />
    </div>
  )
}

export default Home
