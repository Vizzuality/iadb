'use strict';

import './app.css';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import Layers from './components/Layers';
import Timeline from './components/Timeline';
import config from './config';

class App extends React.Component {

  componentDidMount() {
    this.setLayer();
  }

  setLayer() {
    const layersView = this.refs.layers;
    const map = this.refs.map.map;
    const year = this.refs.timeline.getCurrentDate().getFullYear();

    if (this.layer) {
      map.removeLayer(this.layer);
    }

    layersView.getLayer(map, year, (layer) => {
      this.layer = layer;
    });
  }

  render() {
    const config = this.props.config;

    return (
      <div>
        <Layers ref='layers'
          cartodb_username={config.cartodb_username}
          multiple={config.layers.multiple}
          data={config.layers.data}
          onChange={this.setLayer.bind(this)}
        />
        <Map ref='map'
          options={config.map.options}
          basemap={config.map.basemap}
        />
        <Timeline ref='timeline'
          cartodb_username={config.cartodb_username}
          query={config.timeline.query}
          step={config.timeline.step}
          format={config.timeline.format}
          play={config.timeline.play}
          pause={config.timeline.pause}
          onChange={this.setLayer.bind(this)}
        />
      </div>
    );
  }

}

ReactDOM.render(<App config={config} />, document.getElementById('app'));
