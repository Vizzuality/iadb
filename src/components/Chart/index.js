'use strict';

import './style.css';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Chart extends React.Component {

  constructor(props) {
    super(props);
    this.data = [];
    this.state = {
      layerName: props.layerName,
      codgov: props.codgov,
      date: props.date
    };
  }

  fetchData() {
    const username = this.props.cartodbUser;
    const sql = this.props.query
      .replace(/\$\{columnName\}/g, this.state.layerName)
      .replace(/\$\{codgov\}/g, this.state.codgov);
    const url = `https:\/\/${username}.cartodb.com/api/v2/sql?q=${sql}`;
    $.getJSON(url, (d) => {
      this.data = d.rows;
      this.renderSparkLine();
    });
  }

  componentDidUpdate() {
    this.clearView();
    this.fetchData();
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className="chart">
        <h2>{this.props.title}</h2>
        <div className="canvas">
        </div>
      </div>
    );
  }

  renderSparkLine() {
    let data = this.data;
    const el = ReactDOM.findDOMNode(this).getElementsByClassName('canvas')[0];
    const dateFormat = '%Y';
    const margin = {top: 10, left: 30, right: 20, bottom: 25};
    const width = el.clientWidth;
    const height = el.clientHeight;
    const x = d3.time.scale().range([0, width - margin.left - margin.right]).nice();
    const y = d3.scale.linear().range([height - margin.bottom - margin.top, 0]);

    // Creating SVG
    const svg = d3.select(el)
      .append('svg')
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Parsing data
    data.forEach((d) => d.date = new Date(d.year, 0, 1));

    // Domain
    x.domain(d3.extent(data, (d) => d.date));
    y.domain([0, d3.max(data, (d) => {
      return d.average_value > d.value ? d.average_value : d.value;
    })]);

    // X Axis
    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .innerTickSize(-height)
      .ticks(d3.time.years, 2)
      .outerTickSize(0)
      .tickFormat(d3.time.format(dateFormat));

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
        .call(xAxis)
      .selectAll('text')
        .attr('class', 'tick-label')
        .attr('y', margin.bottom / 4)
        .attr('x', 0);

    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
      .append('line')
        .attr('class', 'domain-line')
        .attr('x1', 0)
        .attr('x2', width - margin.left - margin.right)
        .attr('y1', 0)
        .attr('y2', 0);

    // Y Axis
    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .outerTickSize(1)
      .ticks(5);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    function showTooltip (d) {
      tooltip
        .html(`${d.value}`)
        .transition().duration(200)
        .style('opacity', 1)
        .style('top', `${d3.event.pageY - 10}px`)
        .style('left', `${d3.event.pageX}px`);
    }

    function hideTooltip () {
      tooltip.style('opacity', 0);
    }

    // Draw line
    const line = d3.svg.line()
      .interpolate('linear')
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    svg.append('path')
      .datum(data)
      .attr('class', 'sparkline')
      .attr('d', line);

    svg.selectAll('.sparkline')
        .data(data).enter()
      .append('circle')
        .attr('class', 'focus')
        .attr('cx', function(d) { return x(d.date); })
        .attr('cy', function(d) { return y(d.value); })
        .attr('r', 2)
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);

    // Draw average line
    if (data[0].average_value) {
      const avgLine = d3.svg.line()
        .interpolate('linear')
        .x((d) => x(d.date))
        .y((d) => y(d.average_value));

      svg.append('path')
          .datum(data)
          .attr('class', 'avg-sparkline')
          .attr('d', avgLine);

      svg.selectAll('.avg-sparkline')
          .data(data).enter()
        .append('circle')
          .attr('class', 'avg-focus')
          .attr('cx', function(d) { return x(d.date); })
          .attr('cy', function(d) { return y(d.average_value); })
          .attr('r', 2)
          .on('mouseover', showTooltip)
          .on('mouseout', hideTooltip);
    }

  }

  clearView() {
    const el = ReactDOM.findDOMNode(this).getElementsByClassName('canvas')[0];
    el.innerHTML = null;
  }

}

Chart.propTypes = {
  cartodbUser: React.PropTypes.string,
  codgov: React.PropTypes.string,
  date: React.PropTypes.object,
  query: React.PropTypes.string
};

export default Chart;
