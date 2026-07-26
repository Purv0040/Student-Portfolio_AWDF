import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import RepoList from '../components/RepoList.jsx'

const GITHUB_USER = 'HeerGhevariya'
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`

const panel = 'rounded-3xl border border-slate-700/30 bg-[rgba(15,23,42,0.78)] backdrop-blur-lg shadow-2xl'

function Projects() {
  const [repos, setRepos]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const fetchRepos = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body.message || `HTTP ${response.status} – ${response.statusText}`)
        }
        const data = await response.json()
        setRepos(data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
    return () => controller.abort()
  }, [retryCount])

  const handleRetry = () => setRetryCount(c => c + 1)

  return (
    <div className="grid gap-5">
      <section className={`${panel} p-9`}>
        <h2 className="text-2xl font-semibold text-slate-100 mb-1">GitHub Repositories</h2>
        <p className="text-slate-400 text-base leading-relaxed mb-7 max-w-[62ch]">
          Live data pulled from the{' '}
          <a href={`https://github.com/${GITHUB_USER}`}
            target="_blank" rel="noreferrer noopener"
            className="text-sky-300 font-medium hover:underline no-underline"
          >
            {GITHUB_USER}
          </a>{' '}
          GitHub profile via the public REST API.
        </p>

        {loading && <Spinner />}
        {!loading && error && <ErrorMessage message={error} onRetry={handleRetry} />}
        {!loading && !error && <RepoList repos={repos} />}
      </section>
    </div>
  )
}

export default Projects
