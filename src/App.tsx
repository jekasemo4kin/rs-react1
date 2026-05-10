import { Component } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultsList } from './components/ResultsList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BuggyButton } from './components/BuggyButton';
import { PokemonApi, type Pokemon } from './services/api';
import './App.css';

interface State {
  pokemons: Pokemon[];
  isLoading: boolean;
  isError:boolean;
}

class App extends Component<object, State> {
  state: State = {
    pokemons: [],
    isLoading: false,
    isError: false,
  };

  async componentDidMount() {
    const savedTerm = localStorage.getItem('search_term') || '';
    await this.handleSearch(savedTerm);
  }

  handleErrorState = (status: boolean) => {
    this.setState({ isError: status });
  };

  handleSearch = async (term: string) => {
    this.setState({ isLoading: true, isError: false });
    const results = await PokemonApi.searchPokemons(term);
    this.setState({ pokemons: results, isLoading: false });
  };

  render() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <ErrorBoundary 
          resetCondition={this.state.pokemons}
          onErrorTrigger={this.handleErrorState}
        >
          <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-6">PokeAPI Explorer</h1>
            <SearchBar onSearch={this.handleSearch} hasError={this.state.isError} />
          </header>
          
          <main className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-100">
            <ResultsList 
              pokemons={this.state.pokemons} 
              isLoading={this.state.isLoading} 
            />
          </main>

          <BuggyButton />
        </ErrorBoundary>
      </div>
    </div>
  );
}
}

export default App;