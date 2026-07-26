function Skills({ heading, items }) {
  return (
    <section className="rounded-3xl border border-slate-700/30 bg-[rgba(15,23,42,0.78)]
      backdrop-blur-lg shadow-2xl p-9"
    >
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">{heading}</h2>
      <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
        {items.map(skill => (
          <li key={skill}
            className="px-4 py-2.5 rounded-full text-sm text-slate-200
              bg-gradient-to-br from-sky-500/20 to-sky-400/10
              border border-sky-300/20"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Skills