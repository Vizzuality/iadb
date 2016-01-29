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
      date: props.date,
      rank: null,
      maxRank: null,
      population: null
    };
  }

  fetchData() {
    let query = (this.state.layerData.total) ? this.props.queryTotal : this.props.queryPerc;
    const username = this.props.cartodbUser;
    const sql = query
      .replace(/\$\{relatedColumn\}/g, this.state.layerData.relatedColumn || '')
      .replace(/\$\{tableName\}/g, this.state.layerData.tableName || '')
      .replace(/\$\{columnName\}/g, this.state.layerName)
      .replace(/\$\{year\}/g, this.state.date.getFullYear())
      .replace(/\$\{codgov\}/g, this.state.codgov);

    const url = `https:\/\/${username}.cartodb.com/api/v2/sql?q=${sql}`;
    $.getJSON(url, data => {
      const d = data.rows[0];
      this.setState({
        name: d.name,
        value: d.average_value,
        natValue: d.nat_average_value,
        rank: d.rank
      });
    }).fail((err) => {
      throw err.responseText;
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
    let rank = null;
    if (!this.state.name) {
      return (
        <div className="average">
          <h2>Seleccione un municipio en el mapa</h2>
        </div>
      );
    }
    if (this.state.rank) {
      rank = <div className="panels">
        <div className="panel">
          <h3>Ranking</h3>
          <div className="nat-value">{this.state.rank}</div>
        </div>
      </div>;
    }
    const avgNat = (this.state.natValue || this.state.natValue === 0) ? this.state.natValue : '-';
    const avgMun = (this.state.value || this.state.value === 0) ? this.state.value : '-';
    return (
      <div className="average">
        <h2>{this.state.name}</h2>
        {rank}
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
