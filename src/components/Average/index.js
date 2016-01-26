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
      codgov: props.codgov,
      layerName: props.layerName,
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
        value: d.average_value
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.codgov !== this.state.codgov ||
        prevState.layerName !== this.state.layerName ||
        prevState.date !== this.state.date) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    if (!this.state.name) {
      return null;
    }
    const val = this.state.value;
    const total = (val || val === 0) ? val : '-';
    return (
      <div className="average">
        <h2>{this.state.name}</h2>
        <div className="value">{total}</div>
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
