'use strict';

import './style.css';

import React from 'react';
import ReactDOM from 'react-dom';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {year: this.props.year};
  }

  componentDidMount() {
    this.createMap();
    this.setBasemap();
    this.setLayer();
  }

  componentWillReceiveProps(props) {
    if (props.year !== this.state.year) {
      this.setState({year: props.year});
      this.setLayer();
    }
  }

  createMap() {
    const mapOptions = {
      center: this.props.center,
      zoom: this.props.zoom
    };
    this.map = L.map(ReactDOM.findDOMNode(this), mapOptions);
  }

  setBasemap() {
    this.checkMap();
    this.basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    this.basemap.addTo(this.map);
  }

  setLayer() {
    this.checkMap();

    // Removing existing layer
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }

    const cartodbConfig = {
      user_name: 'iadb',
      type: 'cartodb',
      sublayers: [{
        sql: `SELECT a.*, b.reven,b.taxes, b.taxinc
          FROM bra_poladm2 a join table_3fiscal_primera_serie b
          on a.codgov::integer=b.codgov where year=${this.props.year}`,
        cartocss: `#bra_poladm2 {
          polygon-fill: #64d1b8;
          polygon-opacity: 0.8;
          line-color: #FFF;
          line-width: 0.5;
          line-opacity: 1;
        }`,
        interactivity: 'reven, taxes, taxinc'
      }]
    };

    function setLayer(layer) {
      this.layer = layer;
      this.layer.setInteraction(true);
      this.layer.on('featureClick', function(e, latlng, point, data) {
        this.props.setDashboard(data);
      }.bind(this));
    }

    cartodb.createLayer(this.map, cartodbConfig)
      .addTo(this.map)
      .on('done', setLayer.bind(this))
      .on('error', function(err) {
        console.error(err);
      });
  }

  checkMap() {
    if (!this.map) {
      throw 'Map must be initialized, try executing createMap method';
    }
  }

  render() {
    return (
      <div className="map"></div>
    );
  }

}

Map.propTypes = {
  center: React.PropTypes.array,
  zoom: React.PropTypes.number,
  year: React.PropTypes.number
};

export default Map;
