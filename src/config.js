'use strict';

export default {

  /**
   * App configuration
   * @type {Object}
   */
  app: {
    cartodbUser: 'iadb',
    layerName: 'reven',
    date: new Date(2000, 0, 1),
    codgov: null
  },

  /**
   * Average info panel
   * @type {Object}
   * Required: name, average_value
   */
  average: {
    query_total: require('raw!./queries/info-total.psql').replace(/\n/g, ' '),
    query_perc: require('raw!./queries/info-perc.psql').replace(/\n/g, ' ')
  },

  /**
   * Map configuration
   * @type {Object}
   */
  map: {
    // More info: [http://leafletjs.com/reference.html#map-options]
    mapOptions: {
      zoom: 5,
      center: [-16.78350556192777, -54.0087890625],
      zoomControl: false,
      scrollWheelZoom: false
    },
    zoomOptions: {
      position: 'topright'
    },
    // Basemap url
    basemap: 'https://a.tiles.mapbox.com/v4/aliciarenzana.2bebf2c6/{z}/{x}/{y}@2x.png?' +
      'access_token=pk.eyJ1IjoiYWxpY2lhcmVuemFuYSIsImEiOiJjOTQ2OThkM2VkY2I5MjYwNTUyNmIyMmEyZWFmOGZjMyJ9.sa4f1HalXYr3GYTRAsdnzA',
    // Legend colors
    colors: ['#F8D368','#F5E8B7', '#D3E0E5', '#AEC7D5', '#5285A1', '#084769', '#062B3F'],
    cartocssQuery: require('raw!./queries/cartocss.psql').replace(/\n/g, ' ')
  },

  /**
   * Timeline configuration
   * @type {Object}
   * Required: min, max
   */
  timeline: {
    // You should specify query or startDate and endDate
    query: require('raw!./queries/timeline.psql').replace(/\n/g, ' '),
    // You should specify query or startDate and endDate
    startDate: null,
    // You should specify query or startDate and endDate
    endDate: null,
    // [3, 'months']
    step: [1, 'year'],
    // Date showed for step
    format: 'YYYY',
    // Enable play button
    play: true,
    // Miliseconds
    pause: 5000
  },

  /**
   * Layers configuration
   * @type {Object}
   */
  layers: [{
    name: 'Total',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'reven',
    buckets: 7,
    query: require('raw!./queries/layer-reven.psql').replace(/\n/g, ' '),
    interactivity: 'codgov,reven,name',
    unit: 'M R$',
    categoryName:'Revenue',
    relatedColumn: null,
    total: true
  }, {
    name: 'Per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'reven_rate',
    buckets: 7,
    query: require('raw!./queries/layer-reven-rate.psql').replace(/\n/g, ' '),
    interactivity: 'codgov, reven_rate,name',
    unit: 'R$',
    categoryName:'Revenue',
    relatedColumn:'reven',
    total: false
  }, {
    name: 'Total',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxes',
    buckets: 7,
    query: require('raw!./queries/layer-taxes.psql').replace(/\n/g, ' '),
    interactivity: 'codgov,taxes,name',
    unit: 'M R$',
    categoryName: 'Taxes',
    total: true,
    relatedColumn: null
  },
  {
    name: 'Per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'tax_rate',
    buckets: 7,
    query: require('raw!./queries/layer-taxes-rate.psql').replace(/\n/g, ' '),
    interactivity: 'codgov,tax_rate,name',
    unit: 'R$',
    categoryName:'Taxes',
    total: false,
    relatedColumn:'taxes'
  }, {
    name: 'Total',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxinc',
    buckets: 7,
    query: require('raw!./queries/layer-tax-inc.psql').replace(/\n/g, ' '),
    interactivity: 'codgov,taxinc,name',
    unit: 'M R$',
    categoryName: 'Tax. Inc.',
    total: true,
    relatedColumn: null
  },
  {
    name: 'Per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxinc_rate',
    buckets: 7,
    query: require('raw!./queries/layer-tax-inc-rate.psql').replace(/\n/g, ' '),
    interactivity: 'codgov,taxinc_rate,name',
    unit: 'R$',
    categoryName: 'Tax. Inc.',
    total: false,
    relatedColumn:'taxinc'
  },],

  /**
   * Chart
   * @type {Object}
   * Required: name, value, year
   * Optional: average_value
   */
  charts: [{
    title: 'Total',
    query: require('raw!./queries/chart-reven.psql').replace(/\n/g, ' '),
    columnName:'reven',
    unit: 'M R$',
    total: true

  },{
    title: 'Per capita',
    query: require('raw!./queries/chart-reven-rate.psql').replace(/\n/g, ' '),
    columnName:'reven_rate',
    unit: 'R$',
    total: false
  },  {
    title: 'Total',
    query: require('raw!./queries/chart-taxes.psql').replace(/\n/g, ' '),
    columnName:'taxes',
    unit: 'M R$',
    total: true
  },{
    title: 'Per capita',
    query: require('raw!./queries/chart-taxes-rate.psql').replace(/\n/g, ' '),
    columnName:'tax_rate',
    unit: 'R$',
    total: false
  },  {
    title: 'Total',
    query: require('raw!./queries/chart-tax-inc.psql').replace(/\n/g, ' '),
    columnName:'taxinc',
    unit: 'M R$',
    total: true
  },{
    title: 'Per capita',
    query: require('raw!./queries/chart-tax-inc-rate.psql').replace(/\n/g, ' '),
    columnName:'taxinc_rate',
    unit: 'R$',
    total: false
  }]

};
