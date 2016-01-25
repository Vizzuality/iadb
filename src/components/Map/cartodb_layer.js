'use strict';

import './style.css';
import _ from 'lodash';
import React from 'react';

class Layers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {data: this.props.data};
  }

  render() {
    if (!this.state.data || !(this.state.data.length)) {
      return null;
    }
    const layers = this.state.data.map((d, i) => {
      return (
        <li key={i}>
          <label htmlFor={'layer_' + i}>
            <input
              defaultChecked={!!d.active}
              id={'layer_' + i}
              name='layer'
              onChange={this.setSelected.bind(this)}
              defaultValue={d.column_name}
              type={this.props.multiple ? 'checkbox' : 'radio'} /> {d.name}
          </label>
        </li>
      );
    });
    return (
      <div className="layers">
        <ul>{layers}</ul>
      </div>
    );
  }

  setSelected(e) {
    const value = e.currentTarget.value;
    const data = this.state.data.map((d) => {
      if (!this.props.multiple) {
        d.active = false;
      }
      if (value === d.column_name) {
        d.active = e.currentTarget.checked;
      }
      return d;
    });
    this.setState({data: data});
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange();
    }
  }

  getLayer(map, year, callback) {
    const currentLayer = _.find(this.state.data, {active: true});
    this.getCartoCSS(currentLayer, (cartocss) => {
      const cartodbConfig = {
        user_name: this.props.cartodb_username,
        type: 'cartodb',
        sublayers: [{
          sql: currentLayer.query.replace('${year}', year),
          cartocss: cartocss,
          interactivity: currentLayer.interactivity
        }]
      };
      cartodb.createLayer(map, cartodbConfig).addTo(map).done((layer) => {
        if (callback && typeof callback === 'function') {
          callback(layer);
        }
      });
    });
  }

  getCartoCSS(currentLayer, cb) {
    const query = `SELECT CDB_JenksBins(array_agg(${currentLayer.column_name}::numeric), 7)
      FROM ${currentLayer.table_name}`;
    const url = `https:\/\/${this.props.cartodb_username}.cartodb.com/api/v2/sql?q=${query}`;
    $.getJSON(url, function(d) {
      const data = d.rows[0].cdb_jenksbins;
      const cartocss = `#${currentLayer.table_name}{
        polygon-fill: ${colors[0]};
        polygon-opacity: 0.8;
        line-color: #FFF;
        line-width: 0.5;
        line-opacity: 1;
      }
      #${currentLayer.table_name} [${currentLayer.column_name} <= ${data[6]}] {polygon-fill: ${colors[6]};}
      #${currentLayer.table_name} [${currentLayer.column_name} <= ${data[5]}] {polygon-fill: ${colors[5]};}
      #${currentLayer.table_name} [${currentLayer.column_name} <= ${data[4]}] {polygon-fill: ${colors[4]};}
      #${currentLayer.table_name} [${currentLayer.column_name} <= ${data[3]}] {polygon-fill: ${colors[3]};}
      #${currentLayer.table_name} [${currentLayer.column_name} <= ${data[2]}] {polygon-fill: ${colors[2]};}
      #${currentLayer.table_name} [${currentLayer.column_name} <= ${data[1]}] {polygon-fill: ${colors[1]};}
      #${currentLayer.table_name} [${currentLayer.column_name} <= ${data[0]}] {polygon-fill: ${colors[0]};}`;
      cb(cartocss);
    });
  }

}

Layers.propTypes = {
  multiple: React.PropTypes.bool,
  data: React.PropTypes.array.isRequired
};

Layers.defaultProps = {
  multiple: false,
  data: []
};

export default Layers;
