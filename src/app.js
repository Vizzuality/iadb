'use strict';

import './app.css';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import Layers from './components/Layers';
import Timeline from './components/Timeline';
import Average from './components/Average';
import Chart from './components/Chart';
import config from './config';

class App extends React.Component {

  onMapChange(mapData) {
    this.refs.average.setState({codgov: mapData.codgov});
    this.refs.chart.setState({codgov: mapData.codgov});
  }

  onChangeTimeline(timelineData) {
    const layerData = this.refs.layers.state.layer;
    this.refs.map.setState({date: this.refs.timeline.getCurrentDate()});
    this.refs.map.addLayer(layerData);
    this.refs.average.setState({date: timelineData.date});
  }

  onChangeLayers(layerData) {
    this.refs.map.setState({date: this.refs.timeline.getCurrentDate()});
    this.refs.map.addLayer(layerData);
    this.refs.chart.setState({layerName: layerData.columnName});
    this.refs.average.setState({layerName: layerData.columnName});
  }

  render() {
    return (
      <div>
        <Map ref='map'
          cartodbUser={config.app.cartodbUser}
          mapOptions={config.map.mapOptions}
          basemap={config.map.basemap}
          colors={config.map.colors}
          date={config.app.date}
          onChange={this.onMapChange.bind(this)}
        />
        <Layers ref='layers'
          layerName={config.app.layerName}
          layers={config.layers}
          onChange={this.onChangeLayers.bind(this)}
        />
        <Average ref='average'
          cartodbUser={config.app.cartodbUser}
          date={config.app.date}
          layerName={config.app.layerName}
          codgov={config.app.codgov}
          query={config.average.query}
        />
        <Chart ref='chart'
          cartodbUser={config.app.cartodbUser}
          layerName={config.app.layerName}
          date={config.app.date}
          codgov={config.app.codgov}
          query={config.chart.query}
        />
        <Timeline ref='timeline'
          cartodbUser={config.app.cartodbUser}
          query={config.timeline.query}
          step={config.timeline.step}
          format={config.timeline.format}
          play={config.timeline.play}
          pause={config.timeline.pause}
          onChange={this.onChangeTimeline.bind(this)}
        />
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
