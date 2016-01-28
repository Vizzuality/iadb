'use strict';

import './style.css';
import _ from 'lodash';
import React from 'react';

class Layers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      layer: _.find(props.layers, {columnName: props.layerName})
    };
  }

  render() {
    if (!this.props.layers || !(this.props.layers.length)) {
      return null;
    }

    const groups = _.groupBy(this.props.layers, 'categoryName');

    let result = [];

    _.each(groups, (layers, key) => {
      const layersResult = [];
      const activeClass = key === this.state.layer.categoryName ? '_active' : null;
      layers.forEach((d, i) => {
        layersResult.push(
          <li key={`${key}_${i}`}>
            <label htmlFor={`layer_${key}_${i}`}>
              <input
                checked={this.state.layer.columnName === d.columnName}
                id={`layer_${key}_${i}`}
                name="layer"
                onChange={this.setSelected.bind(this)}
                defaultValue={d.columnName}
                type={this.props.multiple ? 'checkbox' : 'radio'} /> {d.name}
            </label>
          </li>
        );
      });

      result.push(
        <li
          className={activeClass}
          key={key}>
          <span data-category={key} onClick={this.changeCategory.bind(this)}>{key}</span>
          <ul>
            {layersResult}
          </ul>
        </li>
      );
    });

    return (
      <div className="layers">
        <ul>{result}</ul>
      </div>
    );
  }

  changeCategory(e) {
    e.stopPropagation();
    const value = e.currentTarget.getAttribute('data-category');
    const currentLayer = _.find(this.props.layers, {categoryName: value});
    this.setState({layer: currentLayer});
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(currentLayer);
    }
  }

  setSelected(e) {
    e.stopPropagation();
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
