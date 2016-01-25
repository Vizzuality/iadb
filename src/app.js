'use strict';

import './app.css';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import Layers from './components/Layers';
import Timeline from './components/Timeline';
import Average from './components/Average';
import config from './config';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      codgov: '0762918753',
      layer: 'reven',
      date: new Date(2000, 0, 1)
    };
  }

  componentDidMount() {
    this.setLayer();
  }

  setLayer() {
    const layersView = this.refs.layers;
    const map = this.refs.map.map;
    const average = this.refs.average;
    const year = this.refs.timeline.getCurrentDate().getFullYear();

    if (this.layer) {
      map.removeLayer(this.layer);
    }

    layersView.getLayer(map, year, (layer) => {
      this.layer = layer;
      this.layer.setInteraction(true);
      this.layer.on('featureClick', (e, latlng, point, d) => {
        this.setState({codgov: d.codgov});
      });
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
        <Average ref='average'
          cartodb_username={config.cartodb_username}
          date={this.state.date}
          codgov={this.state.codgov}
          query={config.average.query}
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
