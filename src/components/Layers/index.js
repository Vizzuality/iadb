'use strict';

import './style.css';
import _ from 'lodash';
import React from 'react';

class Layers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {layer: _.find(props.layers, {columnName: props.layerName})};
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    if (!this.props.layers || !(this.props.layers.length)) {
      return null;
    }
    const layers = this.props.layers.map((d, i) => {
      return (
        <li key={i}>
          <label htmlFor={`layer_${i}`}>
            <input
              defaultChecked={this.state.layer.columnName === d.columnName}
              id={`layer_${i}`}
              name="layer"
              onChange={this.setSelected.bind(this)}
              defaultValue={d.columnName}
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
    const currentLayer = _.find(this.props.layers, {columnName: value});
    this.setState({layer: currentLayer});
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(currentLayer);
    }
  }

}

Layers.propTypes = {
  cartodbUser: React.PropTypes.string,
  layerName: React.PropTypes.string,
  layers: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func
};

Layers.defaultProps = {
  layers: []
};

export default Layers;
