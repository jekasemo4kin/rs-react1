import { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { PokemonDetail } from './pages/PokemonDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BuggyButton } from './components/BuggyButton';
import './App.css';

interface State {
  isCriticalError: boolean;
}

class App extends Component<object, State> {
  state: State = {
    isCriticalError: false,
  };

  handleErrorState = (status: boolean) => {
    this.setState({ isCriticalError: status });
  };

  render() {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <ErrorBoundary 
          resetCondition={this.state.isCriticalError} 
          onErrorTrigger={this.handleErrorState}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/search/all/page/1" replace />} />
            
           {/* Было: <Route path="/search/:query/page/:page" element={<MainPage onErrorTrigger={this.handleErrorState} />}> */}
              <Route path="/search/:query/page/:page" element={<MainPage />}>
              <Route path="pokemon/:id" element={<PokemonDetail />} />
            </Route>

            <Route path="*" element={<Navigate to="/search/all/page/1" replace />} />
          </Routes>

          <BuggyButton />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;