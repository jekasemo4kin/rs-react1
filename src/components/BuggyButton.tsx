import { Component } from 'react';

interface State {
  shouldCrash: boolean;
}

export class BuggyButton extends Component<object, State> {
  state: State = {
    shouldCrash: false,
  };

  handleCrash = () => {
    this.setState({ shouldCrash: true });
  };

  render() {
    if (this.state.shouldCrash) {

      throw new Error('Критическая ошибка компонента!');
    }

    return (
      <button 
        onClick={this.handleCrash}
        style={{ backgroundColor: '#ff4d4d', color: 'white', margin: '10px' }}
      >
        Вызвать ошибку (Test ErrorBoundary)
      </button>
    );
  }
}