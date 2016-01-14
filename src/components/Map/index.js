'use strict';

import './style.css';
import React from 'react';
import ReactDOM from 'react-dom';

const cdbUsername = 'iadb';
const colors = [
  '#FFFFCC', '#C7E9B4', '#7FCDBB', '#41B6C4', '#1D91C0', '#225EA8', '#0C2C84'
];

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
    L.tileLayer(this.props.tileUrl).addTo(this.map);
  }

  setLayer(data) {
    // Removing existing layer
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }

    const cartodbConfig = {
      user_name: cdbUsername,
      type: 'cartodb',
      sublayers: [{
        sql: `SELECT a.*, b.reven,b.taxes, b.taxinc
          FROM bra_poladm2 a join table_3fiscal_primera_serie b
          on a.codgov::integer=b.codgov where year=${data.date.getFullYear()}`,
        interactivity: 'reven, taxes, taxinc'
      }]
    };

    function setLayer(layer) {
      this.layer = layer;
      this.layer.setInteraction(true);
      this.layer.on('featureClick', function(e, latlng, point, data) {
        console.log(data);
        // this.props.setDashboard(data);
      }.bind(this));
    }

    this.getCartoCSS(function(cartocss) {
      cartodbConfig.sublayers[0].cartocss = cartocss;
      cartodb.createLayer(this.map, cartodbConfig)
        .addTo(this.map)
        .on('done', setLayer.bind(this))
        .on('error', function(err) {
          console.error(err);
        });
    }.bind(this));
  }

  getCartoCSS(cb) {
    const query = `SELECT CDB_JenksBins(array_agg(reven::numeric), 7)
      FROM table_3fiscal_primera_serie`;
    const url = `https:\/\/${cdbUsername}.cartodb.com/api/v2/sql?q=${query}`;
    $.getJSON(url, function(d) {
      const data = d.rows[0].cdb_jenksbins;
      const cartocss = `#table_3fiscal_primera_serie{polygon-fill: ${colors[0]}; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1;}
      #table_3fiscal_primera_serie [ reven <= ${data[6]}] {polygon-fill: ${colors[6]};}
      #table_3fiscal_primera_serie [ reven <= ${data[5]}] {polygon-fill: ${colors[5]};}
      #table_3fiscal_primera_serie [ reven <= ${data[4]}] {polygon-fill: ${colors[4]};}
      #table_3fiscal_primera_serie [ reven <= ${data[3]}] {polygon-fill: ${colors[3]};}
      #table_3fiscal_primera_serie [ reven <= ${data[2]}] {polygon-fill: ${colors[2]};}
      #table_3fiscal_primera_serie [ reven <= ${data[1]}] {polygon-fill: ${colors[1]};}
      #table_3fiscal_primera_serie [ reven <= ${data[0]}] {polygon-fill: ${colors[0]};}`;
      cb(cartocss);
    });
  }

}

Map.propTypes = {
  mapOptions: React.PropTypes.object.isRequired
};

export default Map;
