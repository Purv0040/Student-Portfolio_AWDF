function Footer({ email, year }) {
  return (
    <footer className="flex items-center justify-between flex-wrap gap-4 px-9 py-5
      bg-[rgba(15,23,42,0.78)] dark:bg-[rgba(15,23,42,0.78)] border-t border-slate-700/40
      backdrop-blur text-sm text-slate-400"
    >
      <p>
        Contact:{' '}
        <a href={`mailto:${email}`}
          className="text-sky-300 hover:underline no-underline font-medium"
        >
          {email}
        </a>
      </p>
      <p>© {year} Student Portfolio</p>
    </footer>
  )
}

export default Footer