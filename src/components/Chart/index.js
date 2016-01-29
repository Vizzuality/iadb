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
      this.clearView();
      this.renderSparkLine();
    }).fail((err) => {
      throw err.responseText;
    });
  }

  componentDidUpdate() {
    this.clearView();
    this.fetchData();
  }

  componentDidMount() {
    if (this.state.codgov) {
      this.fetchData();
    }
  }

  render() {
    if (!this.state.codgov) {
      return null;
    }
    return (
      <div className="chart">
        <div className="canvas">
        </div>
      </div>
    );
  }

  renderSparkLine() {
    let data = this.data;

    const oEl = ReactDOM.findDOMNode(this);

    if (!oEl) {
      return;
    }

    const el = oEl.getElementsByClassName('canvas')[0];
    const dateFormat = '%Y';
    const margin = {top: 15, left: 40, right: 20, bottom: 35};
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
      return d.average_value > d.nat_average_value ? d.average_value : d.nat_average_value;
    })]);

    // X Axis
    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(d3.time.years, 2)
      .outerTickSize(1)
      .innerTickSize(0)
      .tickFormat(d3.time.format(dateFormat));

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
      .call(xAxis);

    svg.append('text')
      .attr('class', 'x label')
      .attr('x', width / 2)
      .attr('y', height - 17)
      .text('years');

    // Y Axis
    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .outerTickSize(1)
      .innerTickSize(0)
      .ticks(5);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    if (this.props.unit) {
      svg.append('text')
      .attr('class', 'y label')
      .attr('x', -4)
      .attr('y', 0)
      .text(this.props.unit);
    }

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    function showTooltip (d, nat) {
      tooltip
        .html(`${nat ? d.nat_average_value.toFixed(2) : d.average_value.toFixed(2)}`)
        .transition().duration(200)
        .style('opacity', 1)
        .style('top', `${d3.event.pageY}px`)
        .style('left', `${d3.event.pageX}px`);
    }

    function hideTooltip () {
      tooltip.style('opacity', 0);
    }

    // Draw line
    const line = d3.svg.line()
      .interpolate('linear')
      .x((d) => x(d.date))
      .y((d) => y(d.average_value));

    svg.append('path')
      .datum(data)
      .attr('class', 'sparkline')
      .attr('d', line);

    svg.selectAll('dot')
        .data(data).enter()
      .append('circle')
        .attr('class', 'focus')
        .attr('cx', (d) => x(d.date))
        .attr('cy', (d) => y(d.average_value))
        .attr('r', 2)
        .on('mouseover', (d) => {
          showTooltip(d, false);
        })
        .on('mouseout', hideTooltip);

    // Draw average line
    if (data[0].average_value) {
      const avgLine = d3.svg.line()
        .interpolate('linear')
        .x((d) => x(d.date))
        .y((d) => y(d.nat_average_value));

      svg.append('path')
          .datum(data)
          .attr('class', 'avg-sparkline')
          .attr('d', avgLine);

      svg.selectAll('avg-dot')
          .data(data).enter()
        .append('circle')
          .attr('class', 'avg-focus')
          .attr('cx', (d) => x(d.date))
          .attr('cy', (d) => y(d.nat_average_value))
          .attr('r', 2)
          .on('mouseover', (d) => {
            showTooltip(d, true);
          })
          .on('mouseout', hideTooltip);
    }

  }

  clearView() {
    const el = ReactDOM.findDOMNode(this);
    if (el) {
      const chartsElement = el.getElementsByClassName('canvas')[0];
      chartsElement.innerHTML = null;
    }
  }

}

Chart.propTypes = {
  cartodbUser: React.PropTypes.string,
  codgov: React.PropTypes.string,
  date: React.PropTypes.object,
  query: React.PropTypes.string
};

export default Chart;
