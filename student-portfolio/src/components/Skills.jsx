function Skills({ heading, items }) {
  return (
    <section className="panel content-panel">
      <h2>{heading}</h2>
      <ul className="skills-list">
        {items.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  )
}

export default Skills