'use strict';

import './style.css';
import React from 'react';

class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      min: props.min,
      max: props.max,
      buckets: props.buckets
    };
  }

  render() {
    const buckets = [...Array(7)].map((a, i) => {
      return <div className="bucket" key={i}></div>;
    });
    return (
      <div className="legend">
        <div className="legend-value">0</div>
        <div className="buckets">
          {buckets}
        </div>
        <div className="legend-value">100</div>
      </div>
    );
  }

}

export default Legend;
