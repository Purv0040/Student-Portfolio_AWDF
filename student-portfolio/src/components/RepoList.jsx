/**
 * RepoList – renders GitHub repos as styled cards.
 */
function RepoList({ repos }) {
  if (!repos.length) {
    return (
      <p className="text-center text-slate-400 mt-6">
        No public repositories found.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 animate-fade-in">
      {repos.map((repo, index) => (
        <article key={repo.id}
          className="flex flex-col gap-2.5 rounded-[18px] p-7 border
            bg-sky-400/5 border-sky-300/15
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(14,165,233,0.12)]
            hover:border-sky-300/35"
        >
          {/* Index badge */}
          <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Repo name */}
          <h3 className="text-lg font-semibold text-slate-100 m-0 leading-snug">
            {repo.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed m-0 flex-1">
            {repo.description || 'No description provided.'}
          </p>

          {/* Language + stars row */}
          <div className="flex items-center flex-wrap gap-3 mt-1 text-xs">
            {repo.language && (
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                {repo.language}
              </span>
            )}
            <span className="text-amber-400 font-semibold">
              ★ {repo.stargazers_count}
            </span>
            {repo.fork && (
              <span className="px-2 py-0.5 rounded-full text-[0.7rem] font-semibold uppercase
                tracking-wide bg-slate-700/40 text-slate-400 border border-slate-600/40"
              >
                fork
              </span>
            )}
          </div>

          {/* Repo URL */}
          <a href={repo.html_url}
            className="inline-block mt-2 text-sm font-medium text-sky-400
              no-underline hover:opacity-75 transition-opacity duration-150"
            target="_blank"
            rel="noreferrer noopener"
          >
            View on GitHub →
          </a>
        </article>
      ))}
    </div>
  )
}

export default RepoList
