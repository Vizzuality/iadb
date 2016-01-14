'use strict';

import './app.css';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';
import Layers from './components/Layers';
import Timeline from './components/Timeline';

const layersDataSource = [
  {value: 'reven', name: 'Reven', active: true},
  {value: 'taxes', name: 'Taxes', active: false},
  {value: 'taxinc', name: 'Tax Inc.', active: false}
];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null
    };
  }

  setData(data) {
    if (data) {
      this.data = _.extend({}, this.data, data);
    }
    this.data.layerName = this.data.layerName || this.props.layerName;
    this.refs.map.setLayer(this.data);
  }

  componentDidMount() {
    // Getting min and max year from data
    const query = 'SELECT MIN(year), MAX(year) FROM table_3fiscal_primera_serie';
    const url = `https:\/\/${this.props.userName}.cartodb.com/api/v2/sql?q=${query}`;
    $.getJSON(url, (data) => {
      const row = data.rows[0];
      this.setState({
        startDate: new Date(row.min.toString()),
        endDate: new Date(row.max.toString())
      });
    });
  }

  render() {
    let timeline = null;

    if (this.state.startDate && this.state.endDate) {
      timeline = <Timeline
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        step={[1, 'year']}
        format={'YYYY'}
        play={true}
        pause={3000}
        onChange={this.setData.bind(this)}
      />;
    }

    return (
      <div>
        <Layers
          data={layersDataSource}
          onChange={this.setData.bind(this)}
        />
        <Map
          ref='map'
          mapOptions={{center: [-19, -43], zoom: 5}}
          tileUrl={'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'}
        />
        {timeline}
      </div>
    );
  }

}

ReactDOM.render(<App userName='iadb' layerName='reven' />, document.getElementById('app'));
