'use strict';

import './style.css';
import React from 'react';

class Average extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: null,
      value: null
    };
  }

  fetchData() {
    const query = this.props.query
      .replace('${year}', this.props.date.getFullYear())
      .replace('${codgov}', this.props.codgov);
    const url = `https:\/\/${this.props.cartodb_username}.cartodb.com/api/v2/sql?q=${query}`;
    $.getJSON(url, (data) => {
      const d = data.rows[0];
      this.setState({name: d.name, value: d.reven});
    });
  }

  // componentDidUpdate() {
  //   this.fetchData();
  // }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    if (!this.state.name || !this.state.value) {
      return null;
    }
    console.log('render');
    return (
      <div className='average'>
        <h2>{this.state.name}</h2>
        <div className='value'>{this.state.value}</div>
      </div>
    );
  }

}

Average.propTypes = {
  query: React.PropTypes.string,
  date: React.PropTypes.object,
  codgov: React.PropTypes.string
};

export default Average;
