'use strict';

import './style.css';
import React from 'react';

class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      min: props.min,
      max: props.max,
      colors: props.colors
    };
  }

  render() {
    const buckets = this.state.colors.map((a, i) => {
      return <div className="bucket" style={{backgroundColor: a}} key={i}></div>;
    });
    return (
      <div className="legend">
        <div className="legend-value">{this.state.min}</div>
        <div className="buckets">
          {buckets}
        </div>
        <div className="legend-value">{this.state.max}</div>
      </div>
    );
  }

}

export default Legend;
