/**
 * ErrorMessage – shown when the GitHub API call fails.
 */
function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert"
      className="flex items-start gap-4 my-2 mb-6 p-5 rounded-2xl
        bg-red-500/10 border border-red-500/30 animate-fade-in"
    >
      <span className="text-2xl leading-none shrink-0" aria-hidden="true">⚠️</span>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <p className="m-0 text-base font-semibold text-red-300">
          Failed to load repositories
        </p>
        <p className="m-0 text-sm text-red-400/90 break-words">
          {message}
        </p>
      </div>

      {onRetry && (
        <button onClick={onRetry}
          className="shrink-0 self-center px-4 py-2 rounded-full text-sm font-semibold
            text-red-300 border border-red-500/40 bg-red-500/10 cursor-pointer
            transition-all duration-200 hover:bg-red-500/20 hover:-translate-y-0.5"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
