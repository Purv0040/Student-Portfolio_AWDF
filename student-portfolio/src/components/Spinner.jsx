/**
 * Spinner – shown while data is being fetched.
 */
function Spinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-16"
      role="status" aria-label="Loading repositories"
    >
      {/* Animated ring */}
      <span className="block w-14 h-14 rounded-full
        border-4 border-slate-700/50 border-t-sky-400
        animate-spin-ring"
      />
      <p className="text-sm text-slate-400 tracking-wide">Fetching repositories…</p>
    </div>
  )
}

export default Spinner
