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

let layerData = null;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.getCurrentLayer();
  }

  getCurrentLayer() {
    const layerName = this.refs.layers ? this.refs.layers.state.layer : config.app.layerName;
    layerData = _.find(config.layers, {columnName: layerName});
    return layerData;
  }

  onMapChange(mapData) {
    const layerData = this.refs.layers.state.layer;
    if (mapData.codgov) {
      this.refs.dashboard.className = 'dashboard';
      ReactDOM.findDOMNode(this.refs.timeline).className = 'timeline _collapsed';
    }
    this.refs.average.setState({codgov: mapData.codgov, layerData: layerData});
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
    this.refs.average.setState({
      layerName: layerData.columnName,
      layerData: layerData
    });
    config.charts.forEach((c, i) => {
      this.refs[`chart${i}`].setState({layerName: layerData.columnName});
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const charts = [];

    config.charts.forEach((c, i) => {
      charts.push(
        <Chart ref={`chart${i}`}
          cartodbUser={config.app.cartodbUser}
          layerName={config.app.layerName}
          date={config.app.date}
          unit={c.unit}
          codgov={config.app.codgov}
          title={c.title}
          query={c.query}
          key={i}
        />
      );
    });

    return (
      <div>
        <div ref="dashboard" className="dashboard">
          <div className="brand">
            <h1>Datos financieros municipales</h1>
            <img className="logo" src={require('./images/logo.png')} width="192" height="31" />
          </div>
          <Layers ref="layers"
            layerName={config.app.layerName}
            layers={config.layers}
            onChange={this.onChangeLayers.bind(this)}
          />
        </div>
        <Map ref="map"
          cartodbUser={config.app.cartodbUser}
          mapOptions={config.map.mapOptions}
          zoomOptions={config.map.zoomOptions}
          basemap={config.map.basemap}
          colors={config.map.colors}
          date={config.app.date}
          codgov={config.app.codgov}
          onChange={this.onMapChange.bind(this)}
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
      </div>
    );

    // return (
    //   <div>
    //     <Map ref="map"
    //       cartodbUser={config.app.cartodbUser}
    //       mapOptions={config.map.mapOptions}
    //       basemap={config.map.basemap}
    //       colors={config.map.colors}
    //       date={config.app.date}
    //       codgov={config.app.codgov}
    //       onChange={this.onMapChange.bind(this)}
    //     />
    //     <Layers ref="layers"
    //       layerName={config.app.layerName}
    //       layers={config.layers}
    //       onChange={this.onChangeLayers.bind(this)}
    //     />
    //     <Timeline ref="timeline"
    //       cartodbUser={config.app.cartodbUser}
    //       query={config.timeline.query}
    //       step={config.timeline.step}
    //       format={config.timeline.format}
    //       play={config.timeline.play}
    //       pause={config.timeline.pause}
    //       onChange={this.onChangeTimeline.bind(this)}
    //     />
    //     <div ref="dashboard" className="dashboard _hidden">
    //       <Average ref="average"
    //         cartodbUser={config.app.cartodbUser}
    //         date={config.app.date}
    //         layerName={config.app.layerName}
    //         layerData={layerData}
    //         codgov={config.app.codgov}
    //         query={config.average.query}
    //       />
    //       <div className="chart-legend">
    //         <div className="legend-average">National average per year</div>
    //         <div className="legend-value">Average per year</div>
    //       </div>
    //       {charts}
    //     </div>
    //   </div>
    // );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
