'use strict';

import './style.css';
import React from 'react';

class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      min: props.min,
      max: props.max,
      buckets: props.buckets,
      colors: props.colors
    };
  }

  render() {
    const buckets = this.state.colors.slice(0, this.state.buckets).map((a, i) => {
      return <div className="bucket" style={{backgroundColor: a}} key={i}></div>;
    });

    if ((!this.state.min && this.state.min !== 0) ||
      (!this.state.max && this.state.max !== 0)) {
      return null;
    }

    return (
      <div className="legend">
        <div className="legend-value">{this.state.min.toFixed(0)}</div>
        <div className="buckets">
          {buckets}
        </div>
        <div className="legend-value">{this.state.max.toFixed(0)}</div>
      </div>
    );
  }

}

export default Legend;
