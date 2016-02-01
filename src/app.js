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
import Legend from './components/Legend';
import Download from './components/Download';
import config from './config';

let layerData = null;

function getCookie(name) {
  var regexp = new RegExp(`(?:^${name}|;\s*${name})=(.*?)(?:;|$)`, 'g');
  var result = regexp.exec(document.cookie);
  return (result === null) ? null : result[1];
}

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
    const currentChart = _.find(config.charts, {columnName: layerData.columnName});
    if (mapData.codgov) {
      this.refs.dashboard.className = 'dashboard';
      ReactDOM.findDOMNode(this.refs.timeline).className = 'timeline _collapsed';
    }
    this.refs.average.setState({codgov: mapData.codgov, layerData: layerData});
    this.refs.map.updateTopLayer(layerData);
    this.refs.chart.setState({
      chartData: currentChart,
      codgov: mapData.codgov,
      unit: currentChart.unit
    });
    this.refs.download.setState({
      query: currentChart.query,
      codgov: mapData.codgov,
      layerName: layerData.columnName
    });
  }

  onChangeTimeline(timelineData) {
    const layerData = this.refs.layers.state.layer;
    this.refs.map.setState({date: this.refs.timeline.getCurrentDate()});
    this.refs.map.addLayer(layerData);
    this.refs.average.setState({date: timelineData.date});
    this.refs.chart.setState({date: timelineData.date});
  }

  onChangeLayers(layerData) {
    const currentChart = _.find(config.charts, {columnName: layerData.columnName});
    this.refs.map.setState({date: this.refs.timeline.getCurrentDate()});
    this.refs.map.addLayer(layerData);
    this.refs.average.setState({
      layerName: layerData.columnName,
      layerData: layerData
    });
    this.refs.chart.setState({
      chartData: currentChart,
      layerName: layerData.columnName,
      unit: currentChart.unit
    });
    this.refs.download.setState({
      query: currentChart.query,
      layerName: layerData.columnName
    });
  }

  onLayerChange(layerData) {
    this.refs.legend.setState({
      min: layerData.min,
      max: layerData.max,
      buckets: layerData.buckets
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  closeLanding(e) {
    e.preventDefault();
    this.refs.landing.classList.add('_hidden');
    this.refs.dashboard.classList.remove('_hidden');
  }

  render() {
    const currentChart = _.find(config.charts, {columnName: config.app.layerName});

    return (
      <div>
        <div ref='landing' className="landing">
          <div className="title-container">
            <h1>
              <span className="title">Datos</span>
              <span className="title">Financieros</span>
              <span className="title">Municipales</span>
            </h1>
            <p className="subtitle"></p>
            <a href="#"
              onClick={this.closeLanding.bind(this)}
              className="landing-button">Continuar</a>
          </div>
        </div>
        <div className="brand">
          <img className="logo" src={require('./images/smartmap.png')} width="136" height="33" />
          <img className="logo" src={require('./images/logo.png')} width="192" height="31" />
        </div>
        <div ref="dashboard" className="dashboard _hidden">
          <div className="title">
            <h1>Datos financieros municipales</h1>
          </div>
          <Layers ref="layers"
            layerName={config.app.layerName}
            layers={config.layers}
            onChange={this.onChangeLayers.bind(this)}
          />
          <Average ref="average"
            cartodbUser={config.app.cartodbUser}
            date={config.app.date}
            layerName={config.app.layerName}
            layerData={layerData}
            codgov={config.app.codgov}
            queryTotal={config.average.query_total}
            queryPerc={config.average.query_perc}
          />
          <Chart ref='chart'
            cartodbUser={config.app.cartodbUser}
            chartData={currentChart}
            layerName={config.app.layerName}
            date={config.app.date}
            unit={currentChart.unit}
            codgov={config.app.codgov}
            title={currentChart.title}
            query={currentChart.query}
          />
          <Download ref='download'
            cartodbUser={config.app.cartodbUser}
            layerName={config.app.layerName}
            codgov={config.app.codgov} />
          <Legend ref='legend'
            colors={config.map.colors}
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
          cartocssQuery={config.map.cartocssQuery}
          onChange={this.onMapChange.bind(this)}
          onLayerChange={this.onLayerChange.bind(this)}
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
  }

}

if (getCookie('iadb_demo_access') !== 'goin') {
  window.location.href = 'login.html'
} else {
  ReactDOM.render(<App />, document.getElementById('app'));
}
