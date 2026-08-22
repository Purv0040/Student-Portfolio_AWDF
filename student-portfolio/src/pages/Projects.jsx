const projectData = [
  {
    id: 1,
    title: 'Student Portfolio',
    description:
      'A single-page portfolio built with React and Vite. Features a glassmorphism dark-mode design, skill tags, and a contact footer.',
    tech: ['React', 'Vite', 'CSS'],
    link: '#',
  },
  {
    id: 2,
    title: 'Attendify',
    description:
      'Full-stack attendance management system for Charusat. Students can mark attendance with location verification; admins get real-time dashboards.',
    tech: ['Next.js', 'MongoDB', 'Tailwind'],
    link: '#',
  },
  {
    id: 3,
    title: 'Rural GenAI App',
    description:
      'AI-powered conversational assistant designed for rural users. Integrates Gemini API with a FastAPI backend and a React frontend.',
    tech: ['React', 'FastAPI', 'Gemini API'],
    link: '#',
  },
]

function Projects() {
  return (
    <div className="page-grid">
      <section className="panel content-panel">
        <h2 className="page-title">Projects</h2>
        <p className="lede" style={{ marginBottom: '28px' }}>
          A selection of things I&apos;ve built — personal, academic, and
          collaborative.
        </p>

        <div className="projects-grid">
          {projectData.map(project => (
            <article key={project.id} className="project-card">
              <div className="project-card__index">0{project.id}</div>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{project.description}</p>
              <ul className="skills-list project-card__tech">
                {project.tech.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a href={project.link} className="project-card__link">
                View project →
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Projects
