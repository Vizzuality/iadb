'use strict';

import './style.css';

import React from 'react';
import ReactDOM from 'react-dom';

class Timeline extends React.Component {

  render() {
    const diff = (this.props.endYear - this.props.startYear) / this.props.steps;
    const list = [...Array(this.props.steps + 1)].map((s, i) => {
      return <li key={i}>{this.props.startYear + (diff * i)}</li>;
    });
    return (
      <div className="timeline">
        <ul>{list}</ul>
      </div>
    );
  }

}

Timeline.propTypes = {
  startYear: React.PropTypes.number,
  endYear: React.PropTypes.number,
  steps: React.PropTypes.number
};

export default Timeline;
