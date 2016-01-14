'use strict';

import './style.css';
import React from 'react';
import moment from 'moment';

class Timeline extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      current: 0,
      steps: this.getSteps(props)
    };
  }

  getSteps(props) {
    if (props.steps) {
      return 1;
    }
    const startDate = moment(props.startDate);
    const endDate = moment(props.endDate);
    const diff = endDate.diff(startDate, props.step[1]);
    if (diff < 0) {
      return [];
    }
    return [...Array(diff + 1)].map((d, i) => {
      return moment(startDate).add(i * props.step[0], props.step[1]);
    });
  }

  handleClick(e) {
    const value = Number(e.currentTarget.getAttribute('data-index'));
    if (isNaN(value) && value < 0) {
      throw 'value is not a valid number or is less than 0';
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
      const currentDate = moment(this.props.startDate)
        .add(this.state.current * this.props.step[0], this.props.step[1]);
      this.props.onChange({index: this.state.current, date: currentDate._d});
    }
  }

  play() {
    let current = this.state.current;

    this.setState({playing: true});

    // Restart count
    if (current === (this.state.steps.length - 1)) {
      current = -1;
    }

    // Change inmediately
    current = current + 1;
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
    this.triggerChange();
  }

  componentDidUpdate() {
    this.triggerChange();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate || nextProps.endDate) {
      this.setState({steps: this.getSteps(nextProps)});
    }
  }

  render() {
    if (this.state.steps.length <= 1) {
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
    const steps = this.state.steps.map((step, index) => {
      const stepDate = moment(step);
      return <li key={index}
        className={index === this.state.current ? '_active' : ''}
        data-index={index}
        data-date={stepDate.format()}
        onClick={this.handleClick.bind(this)}
      >{stepDate.format(this.props.format)}</li>
    });

    return (
      <div className="timeline -inline">
        {control}
        <ul>
          {steps}
        </ul>
      </div>
    );
  }

}

Timeline.propTypes = {
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,
  step: React.PropTypes.array,
  format: React.PropTypes.string,
  play: React.PropTypes.bool,
  onChange: React.PropTypes.func
};

Timeline.defaultProps = {
  startDate: new Date(),
  endDate: new Date(),
  step: [1, 'year'],
  format: 'YYYY-MM-DD',
  play: true,
  pause: 1000,
  onChange: function() {}
};

export default Timeline;
