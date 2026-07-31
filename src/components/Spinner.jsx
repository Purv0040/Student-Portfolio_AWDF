export default function Spinner({ label = "Fetching GitHub Repositories..." }) {
  return (
    <div id="loading-spinner" className="flex flex-col items-center justify-center p-12 bg-white border border-neutral-200/60 rounded-3xl shadow-sm gap-4 animate-fadeIn">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-display font-semibold text-neutral-800 text-base">{label}</p>
        <p className="text-xs text-neutral-400 font-mono">Executing GET request to api.github.com...</p>
      </div>
    </div>
  );
}
