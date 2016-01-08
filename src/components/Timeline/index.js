'use strict';

import './style.css';

import React from 'react';
import ReactDOM from 'react-dom';

class Timeline extends React.Component {

  handleClick(e) {
    e.preventDefault();
    const currentYear = Number(e.currentTarget.getAttribute('data-year'));
    this.props.setCurrentYear(currentYear);
  }

  render() {
    const list = [];
    const diff = this.props.endYear - this.props.startYear;
    const steps = (this.props.steps > diff) ? diff : this.props.steps;
    for (let y = this.props.startYear; y <= this.props.endYear; y = y + steps) {
      list.push(<li data-year={y} onClick={this.handleClick.bind(this)} key={y}>{y}</li>);
    }
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
  steps: React.PropTypes.number,
  setCurrentYear: React.PropTypes.func
};

export default Timeline;
