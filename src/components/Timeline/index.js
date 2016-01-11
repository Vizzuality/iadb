'use strict';

import './style.css';
import React from 'react';
import moment from 'moment';

class Timeline extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      itemActive: 0,
      playActive: false,
      currentDate: this.props.startDate
    };
  }

  render() {
    let control = null;

    const list = [];
    const startDate = this.props.startDate.valueOf();
    const endDate = this.props.endDate.valueOf();
    const diff = Math.round((endDate - startDate) / this.props.range);

    for (let i = 0; i <= diff; i++) {
      const y = startDate + (i * this.props.range);
      list.push(
        <li
          className={i === this.state.itemActive ? '_active' : null}
          data-year={y}
          data-index={i}
          onClick={this.handleClick.bind(this)}
          key={y}>{moment(y).format(this.props.format)}</li>
      );
    }

    this.itemsLength = list.length;

    if (this.props.play) {
      control = <div
        className={this.state.playActive ? 'control _playing' : 'control'}
        onClick={this.state.playActive ? this.stop.bind(this) : this.play.bind(this)}></div>;
    }

    return (
      <div className="timeline -inline">
        {control}
        <ul>
          {list}
        </ul>
      </div>
    );
  }

  handleClick(e) {
    const el = e.currentTarget;
    this.stop();
    this.setActive(Number(el.getAttribute('data-index')));
  }

  play() {
    this.setState({playActive: !this.state.playActive});
    this.setActive(this.state.itemActive + 1);
    this.runner = setInterval(() => {
      this.setActive(this.state.itemActive + 1);
      if (this.state.itemActive === this.itemsLength - 1) {
        this.stop();
      }
    }, this.props.velocity);
  }

  stop() {
    if (this.runner) {
      clearInterval(this.runner);
    }
    this.setState({playActive: false});
  }

  setActive(i) {
    if (i > this.itemsLength - 1) {
      i = 0;
    }
    const currentDate = this.props.startDate.valueOf() + (i * this.props.range);
    this.setState({itemActive: i, currentDate: moment(currentDate)});
    this.props.onChange(this.state);
  }

}

Timeline.propTypes = {
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
  range: React.PropTypes.number,
  format: React.PropTypes.string,
  play: React.PropTypes.bool,
  onChange: React.PropTypes.func
};

Timeline.defaultProps = {
  startDate: moment().subtract(10, 'years'),
  endDate: moment(),
  // miliseconds in 1 year
  range: 1000 * 60 * 60 * 24 * 365,
  format: 'YYYY-MM-DD',
  play: true,
  velocity: 1000,
  onChange: function() {}
};

export default Timeline;
