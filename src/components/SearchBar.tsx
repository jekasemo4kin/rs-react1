import React, { Component } from 'react';

interface Props {
  onSearch: (term: string) => void;
  hasError: boolean;
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
    if (trimmedTerm === lastTerm && !this.props.hasError) {
      console.log('Запрос дублируется, действие отменено');
      return;
    }
    localStorage.setItem('search_term', trimmedTerm);
    this.props.onSearch(trimmedTerm);
  };

  render() {
  return (
    <div className="flex gap-3 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={(e) => this.setState({ searchTerm: e.target.value })}
          placeholder="Например: pikachu..."
          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
        />
      </div>
      <button 
        onClick={this.handleSearch}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
      >
        Search
      </button>
    </div>
  );
}
}