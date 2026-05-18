import { useState } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { PokemonDetail } from './pages/PokemonDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BuggyButton } from './components/BuggyButton';
import { NotFoundPage } from './pages/NotFoundPage';
import { AboutPage } from './pages/AboutPage';
import './App.css';

export const App = () => {
  const [isCriticalError, setIsCriticalError] = useState<boolean>(false);

  const handleErrorState = (status: boolean) => {
    setIsCriticalError(status);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <nav className="max-w-7xl mx-auto mb-8 bg-white border border-slate-200 rounded-xl px-6 py-4 flex gap-6 shadow-sm">
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
      </nav>

      <ErrorBoundary 
        resetCondition={isCriticalError} 
        onErrorTrigger={handleErrorState}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/search/all/page/1" replace />} />
          
          <Route path="/search/:query/page/:page" element={<MainPage />}>
            <Route path="pokemon/:id" element={<PokemonDetail />} />
          </Route>

          <Route path="/about" element={<AboutPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <BuggyButton />
      </ErrorBoundary>
    </div>
  );
};

export default App;