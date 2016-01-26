'use strict';

import './style.css';
import $ from 'jquery';
import React from 'react';
import moment from 'moment';

class Timeline extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      current: 0,
      startDate: props.startDate,
      endDate: props.endDate,
      steps: []
    };
  }

  getSteps(state) {
    const startDate = moment(state.startDate);
    const endDate = moment(state.endDate);
    const diff = endDate.diff(startDate, this.props.step[1]);
    if (diff < 0) {
      return [];
    }
    return [...Array(diff + 1)].map((d, i) => {
      return moment(startDate).add(i * this.props.step[0], this.props.step[1]);
    });
  }

  handleClick(e) {
    const value = Number(e.currentTarget.getAttribute('data-index'));
    if (isNaN(value) && value < 0) {
      throw new Error('value is not a valid number or is less than 0');
    }
    this.setState({current: value});
  }

  handlePlay() {
    const isPlaying = !this.state.playing;
    if (isPlaying) {
      this.play();
    } else {
      this.stop();
    }
  }

  triggerChange() {
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      const currentDate = this.getCurrentDate();
      this.props.onChange({index: this.state.current, date: currentDate});
    }
  }

  getCurrentDate() {
    const currentDate = moment(this.state.startDate)
        .add(this.state.current * this.props.step[0], this.props.step[1]);
    return currentDate._d;
  }

  play() {
    let current = this.state.current;

    this.setState({playing: true});

    // Restart count
    if (current === (this.state.steps.length - 1)) {
      current = -1;
    }

    // Change inmediately
    current++;
    this.setState({current: current});

    // Setting timer
    this.timer = setInterval(() => {
      current = current + 1;
      // Stopping at end
      if (current === this.state.steps.length) {
        this.stop();
      } else {
        this.setState({current: current});
      }
    }, this.props.pause);
  }

  stop() {
    this.setState({playing: false});
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  componentDidMount() {
    // Checking if query exist
    if (!this.props.query) {
      return;
    }
    // Getting min and max year from data
    const query = this.props.query;
    const url = `https:\/\/${this.props.cartodbUser}.cartodb.com/api/v2/sql?q=${query}`;
    $.getJSON(url, data => {
      const row = data.rows[0];
      const state = {
        startDate: new Date(row.min.toString()),
        endDate: new Date(row.max.toString())
      };
      state.steps = this.getSteps(state);
      this.setState(state);
    });
  }

  componentDidUpdate() {
    this.triggerChange();
  }

  render() {
    const steps = this.state.steps;

    if (steps.length <= 1) {
      return null;
    }

    // Making play/pause buttons depending on play props value
    let control = null;

    if (this.props.play) {
      control = <div
        className={'control ' + (this.state.playing ? '_playing' : '')}
        onClick={this.handlePlay.bind(this)}></div>;
    }

    // Making steps list
    const stepsList = steps.map((step, index) => {
      const stepDate = moment(step);
      return (
        <li key={index}
          className={index === this.state.current ? '_active' : ''}
          data-index={index}
          data-date={stepDate.format()}
          onClick={this.handleClick.bind(this)}
        >{stepDate.format(this.props.format)}</li>
      );
    });

    return (
      <div className="timeline -inline">
        {control}
        <ul>
          {stepsList}
        </ul>
      </div>
    );
  }

}

Timeline.propTypes = {
  cartodbUser: React.PropTypes.string,
  query: React.PropTypes.string,
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
  step: React.PropTypes.array,
  format: React.PropTypes.string,
  play: React.PropTypes.bool,
  onChange: React.PropTypes.func
};

Timeline.defaultProps = {
  cartodbUser: null,
  query: null,
  startDate: new Date(),
  endDate: new Date(),
  step: [1, 'year'],
  format: 'YYYY-MM-DD',
  play: true,
  pause: 1000,
  onChange: function() {}
};

export default Timeline;
