export default function ErrorMessage({ message, onRetry }) {
  return (
    <div id="error-message-box" className="bg-rose-50/80 border border-rose-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-fadeIn">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shrink-0">
          ⚠️
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="font-display font-bold text-rose-900 text-base">
            API Request Failed
          </h4>
          <p className="text-xs sm:text-sm text-rose-700 font-mono break-all">
            {message || 'Failed to fetch repositories from GitHub REST API.'}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          id="retry-fetch-btn"
          onClick={onRetry}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all active:scale-95 shrink-0"
        >
          🔄 Retry Fetch
        </button>
      )}
    </div>
  );
}
