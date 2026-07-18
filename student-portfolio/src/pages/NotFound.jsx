import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page-grid">
      <section className="panel content-panel not-found-panel">
        <div className="not-found-code">404</div>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="lede not-found-lede">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link to="/" className="submit-btn not-found-btn">
          ← Back to Home
        </Link>
      </section>
    </div>
  )
}

export default NotFound
