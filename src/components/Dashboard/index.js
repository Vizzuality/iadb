'use strict';

import './style.css';

import React from 'react';
import ReactDOM from 'react-dom';

class Dashboard extends React.Component {

  render() {
    return (
      <div className="dashboard">
        <div>Reven: {this.props.reven}</div>
        <div>Taxes: {this.props.taxes}</div>
        <div>Taxinc: {this.props.taxinc}</div>
      </div>
    );
  }

}

Dashboard.propTypes = {
  reven: React.PropTypes.number,
  taxes: React.PropTypes.number,
  taxinc: React.PropTypes.number
};

Dashboard.defaultProps = {
  reven: 0,
  taxes: 0,
  taxinc: 0
};

export default Dashboard;
