'use strict';

import './style.css';
import _ from 'lodash';
import React from 'react';

class Layers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {data: this.props.data};
  }

  render() {
    if (!this.state.data || !(this.state.data.length)) {
      return null;
    }
    const layers = this.state.data.map((d, i) => {
      return (
        <li key={i}>
          <label htmlFor={'layer' + i}>
            <input
              defaultChecked={!!d.active}
              id={'layer' + i}
              name='layer'
              onChange={this.setSelected.bind(this)}
              defaultValue={d.value}
              type={this.props.multiple ? 'checkbox' : 'radio'} /> {d.name}
          </label>
        </li>
      );
    });
    return (
      <div className="layers">
        <ul>{layers}</ul>
      </div>
    );
  }

  setSelected(e) {
    const value = e.currentTarget.value;
    const data = this.state.data.map((d) => {
      if (!this.props.multiple) {
        d.active = false;
      }
      if (value === d.value) {
        d.active = e.currentTarget.checked;
      }
      return d;
    });
    this.setState({data: data});
    this.props.onChange({layerName: value});
  }

}

Layers.propTypes = {
  multiple: React.PropTypes.bool,
  data: React.PropTypes.array.isRequired
};

Layers.defaultProps = {
  multiple: false,
  data: []
};

export default Layers;
