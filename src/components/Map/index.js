'use strict';

import './style.css';
import d3 from 'd3';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      codgov: props.codgov,
      date: props.date
    };
  }

  componentDidMount() {
    this.tooltip = d3.select('body').append('div')
      .attr('class', 'map-tooltip');
    this.createMap();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="map">
        <div className="loader">
          <img src={require('../../images/preloader.gif')} width="32" height="32" />
        </div>
        <a href="http://vizzuality.com" className="vizzuality-logo">
          <svg width="84px" height="23px" viewBox="0 0 84 23" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
              <g id="Datos-Financieros-Municipales" transform="translate(-30.000000, -873.000000)">
                <g id="vizzuality" transform="translate(30.000000, 873.000000)">
                  <path d="M17.572,10.732 L17.656,10.732 L17.572,10.823 L17.572,10.732 Z M26.322,10.732 L27.136,10.732 L25.134,12.928 L24.363,12.928 L26.322,10.732 Z M33.875,12.928 L33.994,12.798 L33.994,12.928 L33.875,12.928 Z M7.83,13.915 L8.153,14.012 L7.773,15.139 L7.411,14.045 L7.83,13.915 Z M81.652,12.332 L80.375,12.332 L82.038,7.004 L82.847,4.408 L80.128,4.408 L77.446,4.408 L75.899,4.397 L75.194,7.134 L74.784,5.815 L74.347,4.408 L72.874,4.408 L70.668,4.408 L70.668,2.536 L70.668,0.536 L68.668,0.536 L66.462,0.536 L66.462,0.119 L64.462,0.119 L62.438,0.119 L62.438,0 L60.438,0 L57.756,0 L55.756,0 L55.756,2 L55.756,4.841 C54.716,4.361 53.416,4.11 51.904,4.11 C50.402,4.11 49.141,4.369 48.113,4.852 L48.113,4.468 L46.113,4.468 L43.431,4.468 L41.431,4.468 L41.431,6.468 L41.431,11.294 L41.37,11.294 C41.37,11.79 41.365,12.013 41.344,12.261 C41.314,12.602 41.258,12.83 41.191,12.95 L41.111,13.112 C41.141,13.044 41.052,13.107 40.809,13.107 C40.761,13.107 40.735,13.104 40.703,13.102 C40.689,13.006 40.676,12.863 40.676,12.664 L40.676,6.408 L40.676,4.408 L38.676,4.408 L37.262,4.408 L35.994,4.408 L35.262,4.408 L33.994,4.408 L27.691,4.408 L26.301,4.408 L25.691,4.408 L24.301,4.408 L17.572,4.408 L17.572,2.119 L17.572,0.119 L15.572,0.119 L12.951,0.119 L10.951,0.119 L10.951,2.119 L10.951,4.408 L10.086,4.408 L8.598,4.408 L8.17,5.833 L7.805,7.05 L7.425,5.819 L6.99,4.408 L5.514,4.408 L2.771,4.408 L0,4.408 L0.872,7.038 L4.469,17.881 L4.923,19.252 L6.367,19.252 L9.171,19.252 L10.607,19.252 L10.951,18.234 L10.951,19.252 L12.951,19.252 L14.182,19.252 L15.572,19.252 L16.182,19.252 L17.572,19.252 L23.691,19.252 L25.691,19.252 L27.691,19.252 L35.262,19.252 L37.262,19.252 L37.262,19.051 C38.012,19.372 38.877,19.55 39.895,19.55 C40.593,19.55 41.235,19.461 41.829,19.311 L43.431,19.311 L46.113,19.311 L48.113,19.311 L48.113,19.102 C48.835,19.353 49.638,19.49 50.502,19.49 C51.196,19.49 51.885,19.381 52.541,19.192 L53.855,19.192 L55.756,19.192 L55.756,19.311 L57.756,19.311 L60.438,19.311 L62.438,19.311 L62.438,19.252 L64.401,19.252 L66.401,19.252 L66.401,18.804 C67.154,19.129 68.062,19.311 69.156,19.311 C69.246,19.311 69.324,19.304 69.411,19.302 L69.411,20.707 L69.411,22.448 L71.135,22.688 L71.128,22.687 C71.249,22.704 71.249,22.704 71.376,22.723 C71.891,22.796 72.292,22.826 72.935,22.826 C74.292,22.826 75.323,22.554 76.373,21.784 C77.137,21.188 77.645,20.395 78.101,19.311 L78.726,19.311 L81.652,19.311 L83.652,19.311 L83.652,17.311 L83.652,14.332 L83.652,12.332 L81.652,12.332 Z" id="Page-1" fill="#FFFFFF"></path>
                  <path d="M8.05959091,13.9157834 L5.7432069,6.40884713 L3,6.40884713 L6.59660502,17.2521592 L9.40073354,17.2521592 L13.058384,6.40884713 L10.3151771,6.40884713 L8.05959091,13.9157834 Z M13.1802273,6.40884713 L15.8014671,6.40884713 L15.8014671,17.2521592 L13.1802273,17.2521592 L13.1802273,6.40884713 Z M13.1802273,2.11920382 L15.8014671,2.11920382 L15.8014671,4.74059873 L13.1802273,4.74059873 L13.1802273,2.11920382 Z M17.0207665,8.73241401 L22.4461348,8.73241401 L16.4111787,15.2860828 L16.4111787,17.2521592 L25.9208966,17.2521592 L25.9208966,14.9285924 L20.129627,14.9285924 L25.9208966,8.43446497 L25.9208966,6.40884713 L17.0207665,6.40884713 L17.0207665,8.73241401 Z M26.5304843,8.73241401 L31.894931,8.73241401 L25.9208966,15.2860828 L25.9208966,17.2521592 L35.4915361,17.2521592 L35.4915361,14.9285924 L29.5784232,14.9285924 L35.4915361,8.43446497 L35.4915361,6.40884713 L26.5304843,6.40884713 L26.5304843,8.73241401 Z M43.5991897,11.2942675 C43.5991897,12.1283312 43.5991897,13.1412611 43.1724906,13.9157834 C42.9896019,14.3328153 42.3189687,15.1073376 41.0388715,15.1073376 C39.1490627,15.1073376 38.9052524,13.7370382 38.9052524,12.6645669 L38.9052524,6.40884713 L36.2230909,6.40884713 L36.2230909,13.2603439 C36.2230909,14.2136115 36.2840125,15.2264204 36.8936003,16.1201465 C37.381221,16.775465 38.2347429,17.5499873 40.1244279,17.5499873 C42.0751583,17.5499873 43.1724906,16.7159236 43.6601113,16.1796879 L43.6601113,17.3117006 L46.3423966,17.3117006 L46.3423966,6.46838854 L43.6601113,6.46838854 L43.6601113,11.2942675 L43.5991897,11.2942675 Z M56.766558,9.20898726 C56.766558,7.30245223 55.3644937,6.11089809 52.1335423,6.11089809 C47.5006505,6.11089809 47.3177618,8.85149682 47.3177618,9.56647771 L49.9999232,9.68568153 C49.9999232,9.08990446 50.1828119,8.07697452 52.1944639,8.07697452 C53.8404624,8.07697452 54.0842727,8.85149682 54.0842727,9.68568153 C53.3527179,9.92396815 52.316431,10.2217962 50.6705564,10.4602038 C48.5978589,10.8772357 46.708174,11.7709618 46.708174,14.1540701 C46.708174,16.0009427 48.1711599,17.4904459 50.7314781,17.4904459 C52.0726207,17.4904459 53.2917962,16.9542102 54.0233511,16.3584331 L54.0842727,17.1926178 L57.2541787,17.1926178 C56.766558,16.4776369 56.766558,16.2988917 56.766558,15.4051656 L56.766558,9.20898726 Z M54.0233511,13.3198854 C54.0233511,14.6903057 52.5602414,15.2860828 51.2801442,15.2860828 C49.9390016,15.2860828 49.4513809,14.6903057 49.4513809,13.9753248 C49.4513809,12.8433121 50.6705564,12.6645669 51.889732,12.4858217 C52.8650972,12.3666178 53.5356066,12.0687898 53.9623056,11.8900446 L53.9623056,13.3198854 L54.0233511,13.3198854 Z M57.9857335,2 L60.667895,2 L60.667895,17.3117006 L57.9857335,17.3117006 L57.9857335,2 Z M62.0699592,2.11920382 L64.6911991,2.11920382 L64.6911991,4.74059873 L62.0699592,4.74059873 L62.0699592,2.11920382 Z M77.6756787,6.40884713 L75.6029812,14.4518981 L73.1037085,6.40884713 L68.8975157,6.40884713 L68.8975157,2.53623567 L66.2152304,2.53623567 L66.2152304,6.40884713 L62.0090376,6.40884713 L62.0090376,17.2521592 L64.6302774,17.2521592 L64.6302774,8.25571975 L66.2152304,8.25571975 L66.2152304,14.6903057 C66.2152304,16.4776369 66.9467853,17.3117006 69.3851364,17.3117006 C70.2995799,17.3117006 70.9091677,17.1924968 71.2748213,17.1329554 L71.2748213,14.9285924 C70.9700893,14.9881338 70.5433903,15.0476752 70.1165674,15.0476752 C69.9947241,15.0476752 69.446058,15.0476752 69.1412022,14.7498471 C68.8973918,14.5115605 68.8973918,14.0348662 68.8973918,13.6178344 L68.8973918,8.25571975 L70.8481223,8.25571975 L74.2009169,17.4309045 C74.1399953,17.6691911 73.8960611,18.5629172 72.3721536,18.5629172 C72.1892649,18.5629172 71.8844091,18.5629172 71.6405987,18.5032548 L71.6405987,20.7077389 C72.0672978,20.7672803 72.3721536,20.8268217 73.1646301,20.8268217 C74.0180282,20.8268217 74.6885376,20.7077389 75.4200925,20.1715032 C76.3345361,19.4565223 76.8832022,17.4904459 77.3099013,16.1796879 L80.3578401,6.40884713 L77.6756787,6.40884713 Z M78.9557759,14.3328153 L81.8818715,14.3328153 L81.8818715,17.3117006 L78.9557759,17.3117006 L78.9557759,14.3328153 Z" id="Fill-1" fill="#64D1B8"></path>
                </g>
              </g>
            </g>
          </svg>
        </a>
      </div>
    );
  }

  createMap() {
    this.map = L.map(ReactDOM.findDOMNode(this), this.props.mapOptions);
    L.tileLayer(this.props.basemap).addTo(this.map);
    L.control.zoom(this.props.zoomOptions).addTo(this.map);
  }

  addLayer(layerData) {
    const el = ReactDOM.findDOMNode(this);
    const cartodbConfig = {
      'user_name': this.props.cartodbUser,
      'type': 'cartodb'
    };
    el.classList.add('_loading');
    this.removeLayer();
    this.getCartoCSS(layerData, cartocss => {
      cartodbConfig.sublayers = [{
        sql: layerData.query.replace(/\$\{year\}/g, this.state.date.getFullYear()),
        cartocss: cartocss,
        interactivity: layerData.interactivity
      }];
      cartodb.createLayer(this.map, cartodbConfig)
        .addTo(this.map, 0)
        .done(layer => {
          this.removeLayer();
          this.layer = layer;
          this.layer.setInteraction(true);
          this.layer.on('load', () => {
            el.classList.remove('_loading');
          });
          this.layer
            .on('featureOver', _.debounce((e, latlng, point, d) => {
              this.tooltip
                .html(`${d.name}`)
                .transition().duration(50)
                .style('opacity', 1)
                .style('top', `${point.y}px`)
                .style('left', `${point.x}px`);
            }, 5))
            .on('featureOver', _.debounce(() => {
              this.tooltip.style('opacity', 0);
            }, 1000))
            .on('featureClick', (e, latlng, point, d) => {
              this.setState({codgov: d.codgov});
              this.props.onChange(d);
            });
          if (this.props.onLayerChange && typeof this.props.onLayerChange === 'function') {
            this.props.onLayerChange(layerData);
          }
        });
    });
  }

  updateLayer(layerData) {
    const layer = this.layer;
    if (layer) {
      this.getCartoCSS(layerData, cartocss => {
        layer.getSubLayer(0).setCartoCSS(cartocss);
      });
    }
  }

  removeLayer() {
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }
  }

  getCartoCSS(layerData, cb) {
    const colors = this.props.colors;
    const query = this.props.cartocssQuery
      .replace(/\$\{columnName\}/g, layerData.columnName)
      .replace(/\$\{tableName\}/g, layerData.tableName)
      .replace(/\$\{year\}/g, this.state.date.getFullYear());
    const url = `https:\/\/${this.props.cartodbUser}.cartodb.com/api/v2/sql?q=${query}`;
    $.getJSON(url, (d) => {
      const data = d.rows[0].buckets;
      const cartocss = `#${layerData.tableName}{
        polygon-fill: transparent;
        polygon-opacity: 1;
        line-color: #FFF;
        line-width: 0.3;
        line-opacity: 0.7;
      }
      #${layerData.tableName} [${layerData.columnName} <= ${data[4]}] {polygon-fill: ${colors[4]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[3]}] {polygon-fill: ${colors[3]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[2]}] {polygon-fill: ${colors[2]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[1]}] {polygon-fill: ${colors[1]};}
      #${layerData.tableName} [${layerData.columnName} <= ${data[0]}] {polygon-fill: ${colors[0]};}
      #${layerData.tableName} [${layerData.columnName} < ${d.rows[0].min}] {polygon-fill: transparent;}
      `;
      layerData.min = d.rows[0].min;
      layerData.max = d.rows[0].max;
      cb(cartocss);
    }).fail((err) => {
      throw err.responseText;
    });
  }

  updateTopLayer(layerData) {
    if (this.state.codgov) {
      const el = ReactDOM.findDOMNode(this);
      const cartocss = `#bra_poladm2 [codgov=${this.state.codgov}] {
        polygon-fill: transparent;
        polygon-opacity: 0;
        line-color: #F11810;
        line-width: 5;
        line-opacity: 1;
      }`;

      el.classList.add('_loading');

      if (this.topLayer) {
        this.topLayer.setCartoCSS(cartocss);
      } else {
        const cartodbConfig = {
          'user_name': this.props.cartodbUser,
          type: 'cartodb',
          sublayers: [{
            sql: 'SELECT the_geom_webmercator, codgov FROM bra_poladm2',
            cartocss: cartocss
          }]
        };
        cartodb.createLayer(this.map, cartodbConfig)
          .addTo(this.map, 1)
          .done((topLayer) => {
            this.topLayer = topLayer;
            this.topLayer.on('load', () => {
              el.classList.remove('_loading');
            });
          });
      }
    }
  }

}

Map.propTypes = {
  mapOptions: React.PropTypes.object.isRequired,
  basemap: React.PropTypes.string
};

export default Map;
