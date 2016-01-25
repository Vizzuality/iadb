'use strict';

import './style.css';
import React from 'react';
import ReactDOM from 'react-dom';

class Map extends React.Component {

  componentDidMount() {
    this.createMap();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="map"></div>
    );
  }

  createMap() {
    this.map = L.map(ReactDOM.findDOMNode(this), this.props.mapOptions);
    L.tileLayer(this.props.basemap).addTo(this.map);
  }

  addLayer(layerName, layer) {
    this.layers[layerName] = layer;
    this.map.addLayer(layer);
  }

  removeLayer(layerName) {
    const layer = this.layers[layerName];
    if (layer) {
      this.map.removeLayer(layer);
    }
  }

}

Map.propTypes = {
  mapOptions: React.PropTypes.object.isRequired,
  basemap: React.PropTypes.string
};

export default Map;
