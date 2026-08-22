function Footer({ email, year }) {
  return (
    <footer className="panel footer-panel">
      <p>
        Contact: <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>© {year} Student Portfolio</p>
    </footer>
  )
}

export default Footer