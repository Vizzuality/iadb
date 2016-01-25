'use strict';

import './style.css';
import React from 'react';
import ReactDOM from 'react-dom';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date
    };
  }

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

  addLayer(layerData) {
    const cartodbConfig = {
      user_name: this.props.cartodbUser,
      type: 'cartodb',
      sublayers: []
    };
    this.removeLayer();
    this.getCartoCSS(layerData, (cartocss) => {
      cartodbConfig.sublayers = [{
        sql: layerData.query.replace('${year}', this.state.date.getFullYear()),
        cartocss: cartocss,
        interactivity: layerData.interactivity
      }];
      cartodb.createLayer(this.map, cartodbConfig)
        .addTo(this.map)
        .done((layer) => {
          this.layer = layer;
          this.layer.setInteraction(true);
          this.layer.on('featureClick', (e, latlng, point, d) => {
            this.props.onChange(d);
          });
        });
    });
  }

  removeLayer() {
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }
  }

  getCartoCSS(layerData, cb) {
    const colors = this.props.colors;
    const query = `SELECT CDB_JenksBins(array_agg(${layerData.columnName}::numeric), 7)
      FROM ${layerData.tableName}`;
    const url = `https:\/\/${this.props.cartodbUser}.cartodb.com/api/v2/sql?q=${query}`;
    $.getJSON(url, (d) => {
      const data = d.rows[0].cdb_jenksbins;
      const cartocss = `#${layerData.tableName}{
        polygon-fill: ${colors[0]};
        polygon-opacity: 0.8;
        line-color: #FFF;
        line-width: 0.5;
        line-opacity: 1;
      }
      #${layerData.tableName} [${layerData.columnName} <= ${data[6]}] {polygon-fill: ${colors[6]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[5]}] {polygon-fill: ${colors[5]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[4]}] {polygon-fill: ${colors[4]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[3]}] {polygon-fill: ${colors[3]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[2]}] {polygon-fill: ${colors[2]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[1]}] {polygon-fill: ${colors[1]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[0]}] {polygon-fill: ${colors[0]};}`;
      cb(cartocss);
    });
  }

}

Map.propTypes = {
  mapOptions: React.PropTypes.object.isRequired,
  basemap: React.PropTypes.string
};

export default Map;
