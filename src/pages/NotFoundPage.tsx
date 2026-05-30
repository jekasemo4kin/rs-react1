import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-black text-slate-300 select-none animate-pulse">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-2">
        Page Not Found
      </h2>
      <p className="text-slate-500 max-w-md mb-8">
        Oops! The page you are looking for does not exist or has been moved to another URL.
      </p>
      <Link
        to="/search/all/page/1"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
      >
        Return to Main App
      </Link>
    </div>
  );
}

export default NotFoundPage;