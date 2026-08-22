function Header({ title, name }) {
  return (
    <header className="panel header-panel">
      <p className="eyebrow">{title}</p>
      <h1>{name}</h1>
      <p className="lede">
        A compact profile page that highlights background, skills, and contact
        details.
      </p>
    </header>
  )
}

export default Header