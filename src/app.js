'use strict';

import './app.css';
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
    const layerData = this.refs.layers.state.layer;
    this.refs.average.setState({codgov: mapData.codgov});
    this.refs.map.updateLayer(layerData);
    config.charts.forEach((c, i) => {
      this.refs[`chart${i}`].setState({codgov: mapData.codgov});
    });
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
    this.refs.average.setState({layerName: layerData.columnName});
    config.charts.forEach((c, i) => {
      this.refs[`chart${i}`].setState({layerName: layerData.columnName});
    });
  }

  render() {
    const charts = [];

    config.charts.forEach((c, i) => {
      charts.push(
        <Chart ref={`chart${i}`}
          cartodbUser={config.app.cartodbUser}
          layerName={config.app.layerName}
          date={config.app.date}
          codgov={config.app.codgov}
          title={c.title}
          query={c.query}
          key={i}
        />
      );
    });

    return (
      <div>
        <Map ref="map"
          cartodbUser={config.app.cartodbUser}
          mapOptions={config.map.mapOptions}
          basemap={config.map.basemap}
          colors={config.map.colors}
          date={config.app.date}
          codgov={config.app.codgov}
          onChange={this.onMapChange.bind(this)}
        />
        <Layers ref="layers"
          layerName={config.app.layerName}
          layers={config.layers}
          onChange={this.onChangeLayers.bind(this)}
        />
        <Timeline ref="timeline"
          cartodbUser={config.app.cartodbUser}
          query={config.timeline.query}
          step={config.timeline.step}
          format={config.timeline.format}
          play={config.timeline.play}
          pause={config.timeline.pause}
          onChange={this.onChangeTimeline.bind(this)}
        />
        <div className="dashboard">
          <Average ref="average"
            cartodbUser={config.app.cartodbUser}
            date={config.app.date}
            layerName={config.app.layerName}
            codgov={config.app.codgov}
            query={config.average.query}
          />
          {charts}
        </div>
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
