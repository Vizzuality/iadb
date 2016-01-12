'use strict';

import './style.css';
import React from 'react';
import moment from 'moment';

class Timeline extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      current: this.props.startDate,
      steps: this.calculateSteps()
    };
  }

  calculateSteps() {
    const steps = [];
    const startDate = moment(this.props.startDate);
    const endDate = moment(this.props.endDate);
    const diff = endDate.diff(startDate, this.props.step[1]);
    for (let d = 0; d <= diff; d++) {
      const stepDate = moment(startDate)
        .add(d * this.props.step[0], this.props.step[1]);
      steps.push(stepDate._d);
    }
    return steps;
  }

  calculateNext() {
    // const isEnd = moment(this.state.current)
    //     .isSame(moment(this.props.endDate), this.props.step[1]);
    // if (isEnd) {
    //   return moment(this.props.startDate);
    // }
    return moment(this.state.current)
      .add(1 * this.props.step[0], this.props.step[1]);
  }

  handleClick(e) {
    const value = new Date(e.currentTarget.getAttribute('data-date'));
    this.stop();
    this.setState({current: value});
  }

  play() {
    this.setState({
      playing: !this.state.playing,
      current: this.calculateNext()
    });
    this.runner = setInterval(() => {
      this.setState({current: this.calculateNext()});
    }, this.props.velocity);
  }

  stop() {
    if (this.runner) {
      clearInterval(this.runner);
    }
    this.setState({playing: false});
  }

  render() {
    const list = this.state.steps.map((step) => {
      const isActive = this.state.current.valueOf() === step.valueOf();
      const date = moment(step);
      return <li
          key={step.valueOf()}
          className={isActive ? '_active' : null}
          data-date={date.format()}
          onClick={this.handleClick.bind(this)}
        >{date.format(this.props.format)}</li>
    });

    let control = null;

    if (this.props.play) {
      control = <div
        className={this.state.playing ? 'control _playing' : 'control'}
        onClick={this.state.playing ? this.stop.bind(this) : this.play.bind(this)}></div>;
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

}

Timeline.propTypes = {
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
  step: React.PropTypes.array,
  format: React.PropTypes.string,
  play: React.PropTypes.bool,
  onChange: React.PropTypes.func
};

Timeline.defaultProps = {
  startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
  endDate: new Date(),
  step: [1, 'year'],
  format: 'YYYY-MM-DD',
  play: true,
  velocity: 1000,
  onChange: function() {}
};

export default Timeline;
