'use strict';

import React from 'react';
import Map from '../../components/Map';
import Timeline from '../../components/Timeline';
// import Dashboard from '../../components/Dashboard';

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

Map.propTypes = {
  center: React.PropTypes.array,
  zoom: React.PropTypes.number
};

export default App;
