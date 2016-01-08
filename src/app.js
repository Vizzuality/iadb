'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {year: 2000};
  }

  setCurrentYear(year) {
    this.setState({year: year});
  }

  setDashboard(props) {
    this.setState(props);
  }

  render() {
    return (
      <div>
        <Map
          center={[-19, -43]}
          zoom={5}
          year={this.state.year}
          setDashboard={this.setDashboard.bind(this)} />
        <Timeline
          startYear={2000}
          endYear={2012}
          steps={1}
          setCurrentYear={this.setCurrentYear.bind(this)} />
        <Dashboard
          reven={this.state.reven}
          taxes={this.state.taxes}
          taxinc={this.state.taxinc} />
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
