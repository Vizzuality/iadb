'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import Timeline from './components/Timeline';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {year: 2000};
  }

  setCurrentYear(year) {
    this.setState({year: year});
  }

  render() {
    return (
      <div>
        <Map center={[-19, -43]} zoom={5} year={this.state.year} />
        <Timeline startYear={2000} endYear={2012} steps={1} setCurrentYear={this.setCurrentYear.bind(this)} />
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
