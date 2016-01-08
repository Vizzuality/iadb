'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import Timeline from './components/Timeline';

class App extends React.Component {

  render() {
    return (
      <div>
        <Map center={[40, -3]} zoom={5} />
        <Timeline startYear={1990} endYear={2010} steps={10} />
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
