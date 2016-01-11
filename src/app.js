'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Map from './components/Map';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {year: 2000};
  }

  setCurrentYear(props) {
    this.setState({year: props.currentDate.year()});
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
          startDate={moment({year: 2000, month: 0, day: 2})}
          endYear={moment({year: 2012, month: 0, day: 2})}
          format={'YYYY'}
          play={true}
          velocity={3000}
          onChange={this.setCurrentYear.bind(this)} />
        <div>
          <Dashboard
            reven={this.state.reven}
            taxes={this.state.taxes}
            taxinc={this.state.taxinc} />
        </div>
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
