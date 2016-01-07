'use strict';

import 'leaflet/dist/leaflet.css';
import './style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';

class Map extends React.Component {

  componentDidMount() {
    const map = this.map = L.map(ReactDOM.findDOMNode(this), {
      center: this.props.center,
      zoom: this.props.zoom
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
  }

  render() {
    return (
      <div className="map"></div>
    );
  }

}

export default Map;
