import { Link } from 'react-router-dom'

const panel = 'rounded-3xl border border-slate-700/30 bg-[rgba(15,23,42,0.78)] backdrop-blur-lg shadow-2xl'

function NotFound() {
  return (
    <div className="grid gap-5">
      <section className={`${panel} flex flex-col items-center text-center gap-4 py-20 px-9`}>
        {/* Giant gradient 404 */}
        <div className="font-black leading-none select-none
          bg-gradient-to-br from-sky-500 via-sky-300 to-sky-400
          bg-clip-text text-transparent"
          style={{ fontSize: 'clamp(5rem,20vw,10rem)', letterSpacing: '-0.05em' }}
        >
          404
        </div>

        <h2 className="text-3xl font-semibold text-slate-100 m-0">Page Not Found</h2>

        <p className="text-slate-400 text-base leading-relaxed max-w-[48ch] m-0">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link to="/"
          className="mt-2 px-7 py-3 rounded-full font-bold text-sm no-underline
            bg-gradient-to-r from-sky-500 to-sky-400 text-[#020617]
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(14,165,233,0.35)]"
        >
          ← Back to Home
        </Link>
      </section>
    </div>
  )
}

export default NotFound
