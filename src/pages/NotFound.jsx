import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div 
      id="not-found-page" 
      className="bg-white border border-neutral-200/60 rounded-3xl p-10 sm:p-16 shadow-sm flex flex-col items-center justify-center text-center gap-6 animate-fadeIn"
    >
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl font-black">
        !
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950">
          404 - Page Not Found
        </h2>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          The routing index was unable to locate this directory. The requested resource may have moved or does not exist.
        </p>
      </div>
      
      <Link 
        id="not-found-back-home" 
        to="/" 
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/10 transition-all active:scale-98"
      >
        ← Return to Home Page
      </Link>
    </div>
  );
}
