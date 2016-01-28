'use strict';

import './style.css';
import $ from 'jquery';
import React from 'react';

class Average extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: null,
      value: null,
      natValue: null,
      codgov: props.codgov,
      layerName: props.layerName,
      layerData: props.layerData,
      date: props.date
    };
  }

  fetchData() {
    const username = this.props.cartodbUser;
    const sql = this.props.query
      .replace(/\$\{columnName\}/g, this.state.layerName)
      .replace(/\$\{year\}/g, this.state.date.getFullYear())
      .replace(/\$\{codgov\}/g, this.state.codgov)
      .replace(/\n/g, ' ');
    const url = `https:\/\/${username}.cartodb.com/api/v2/sql?q=${sql}`;
    $.getJSON(url, data => {
      const d = data.rows[0];
      this.setState({
        name: d.name,
        value: d.average_value,
        natValue: d.nat_average_value
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.codgov) {
      return;
    }
    if (!this.state.name) {
      this.fetchData();
    }
    if (prevState.codgov !== this.state.codgov ||
        prevState.layerName !== this.state.layerName ||
        prevState.date !== this.state.date) {
      this.fetchData();
    }
  }

  componentDidMount() {
    if (this.state.codgov) {
      this.fetchData();
    }
  }

  render() {
    if (!this.state.name) {
      return (
        <div className="average">
          <h2>Seleccione un municipio en el mapa</h2>
        </div>
      );
    }
    const avgNat = (this.state.natValue || this.state.natValue === 0) ? this.state.natValue : '-';
    const avgMun = (this.state.value || this.state.value === 0) ? this.state.value : '-';
    return (
      <div className="average">
        <h2>{this.state.name}</h2>
        <div className="panels">
          <div className="panel">
            <div className="nat-value">{avgNat} <span className="unit">{this.state.layerData.unit}</span></div>
            <h3>Media nacional</h3>
          </div>
          <div className="panel">
            <div className="value">{avgMun} <span className="unit">{this.state.layerData.unit}</span></div>
            <h3>Media municipal</h3>
          </div>
        </div>
      </div>
    );
  }

}

Average.propTypes = {
  cartodbUser: React.PropTypes.string,
  layerName: React.PropTypes.string,
  codgov: React.PropTypes.string,
  date: React.PropTypes.object,
  query: React.PropTypes.string
};

export default Average;
