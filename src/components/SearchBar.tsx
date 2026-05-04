import React, { Component } from 'react';

interface Props {
  onSearch: (term: string) => void;
}

interface State {
  searchTerm: string;
}

export class SearchBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const savedTerm = localStorage.getItem('search_term') || '';
    this.state = { searchTerm: savedTerm };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    const { searchTerm } = this.state;
    const trimmedTerm = searchTerm.trim();
    const lastTerm = localStorage.getItem('search_term') || '';
    if (trimmedTerm === lastTerm) {
      console.log('Запрос дублируется, действие отменено');
      return;
    }
    localStorage.setItem('search_term', trimmedTerm);
    this.props.onSearch(trimmedTerm);
  };

  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          placeholder="Search pokemons..."
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}