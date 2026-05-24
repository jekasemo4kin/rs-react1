import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { PokemonDetail } from './pages/PokemonDetail';
import { BuggyButton } from './components/BuggyButton';
import { NotFoundPage } from './pages/NotFoundPage';
import { AboutPage } from './pages/AboutPage';
import './App.css';
import { useTheme } from './hooks/useTheme';

export const App = () => {

  const { theme, toggleTheme } = useTheme();

  return (

    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4 transition-colors">
      <nav className="max-w-7xl mx-auto mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex gap-6">
          <NavLink
            to="/search/all/page/1"
            className={({ isActive }) =>
              `font-bold transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            Home / Search
          </NavLink>
        
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `font-bold transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            About
          </NavLink>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-bold transition-all"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>

      </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/search/all/page/1" replace />} />
          <Route path="/search/:query/page/:page" element={<MainPage />}>
            <Route path="pokemon/:id" element={<PokemonDetail />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <BuggyButton />
      
    </div>
  );
};

export default App;