import { useState } from 'react'
import Skills from '../components/Skills.jsx'

const aboutText =
  'IT student at Charusat University, passionate about web development and software engineering. Skilled in React, JavaScript, HTML, CSS, C++, and Git. Eager to contribute to innovative projects and enhance technical expertise.'

const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'C++', 'Git']

function Home() {
  const [showBio, setShowBio] = useState(true)

  return (
    <div className="page-grid">
      {/* Hero */}
      <header className="panel header-panel">
        <p className="eyebrow">Student Portfolio</p>
        <h1>Heer Ghevariya</h1>
        <p className="lede">
          A compact profile page that highlights background, skills, and contact
          details.
        </p>
      </header>

      {/* About — toggleable */}
      <section className="panel content-panel">
        <div className="section-heading-row">
          <h2>About Me</h2>
          <button
            className="toggle-btn"
            onClick={() => setShowBio(prev => !prev)}
            aria-expanded={showBio}
          >
            {showBio ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className={`collapsible ${showBio ? 'collapsible--open' : ''}`}>
          <p className="lede">{aboutText}</p>
        </div>
      </section>

      {/* Skills */}
      <Skills heading="Core Skills" items={skills} />
    </div>
  )
}

export default Home
