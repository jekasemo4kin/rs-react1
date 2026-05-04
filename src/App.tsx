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
}

class App extends Component<object, State> {
  state: State = {
    pokemons: [],
    isLoading: false,
  };

  async componentDidMount() {
    const savedTerm = localStorage.getItem('search_term') || '';
    await this.handleSearch(savedTerm);
  }

  handleSearch = async (term: string) => {
    this.setState({ isLoading: true });

    const results = await PokemonApi.searchPokemons(term);
    this.setState({ pokemons: results, isLoading: false });
  };

  render() {
    return (
      <ErrorBoundary>
        <div className="app-container">
          <header>
            <h1>PokeSearch (Class Components)</h1>
            <BuggyButton />
          </header>
          
          <main>
            <SearchBar onSearch={this.handleSearch} />
            <ResultsList 
              pokemons={this.state.pokemons} 
              isLoading={this.state.isLoading} 
            />
          </main>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;