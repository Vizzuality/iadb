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
    codgov: '0762918753'
  },

  /**
   * Average info panel
   * @type {Object}
   * Required: name, average_value
   */
  average: {
    query: 'SELECT a.nam_2 AS name, AVG(b.${columnName}) AS average_value FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' AND year=${year} GROUP BY a.nam_2'
  },

  /**
   * Map configuration
   * @type {Object}
   */
  map: {
    // More info: [http://leafletjs.com/reference.html#map-options]
    mapOptions: {
      zoom: 5,
      center: [-16.78350556192777, -54.0087890625]
    },
    // Basemap url
    basemap: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    // Legend colors
    colors: ['#FFFFCC', '#C7E9B4', '#7FCDBB', '#41B6C4', '#1D91C0', '#225EA8', '#0C2C84']
  },

  /**
   * Timeline configuration
   * @type {Object}
   * Required: min, max
   */
  timeline: {
    // You should specify query or startDate and endDate
    query: 'SELECT MIN(year), MAX(year) FROM table_3fiscal_primera_serie',
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
    name: 'Reven',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'reven',
    buckets: 7,
    query: 'SELECT a.*, b.reven FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,reven'
  }, {
    name: 'Taxes',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxes',
    buckets: 7,
    query: 'SELECT a.*, b.taxes FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,taxes'
  }, {
    name: 'Tax. Inc.',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxinc',
    buckets: 7,
    query: 'SELECT a.*, b.taxinc FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,taxinc'
  }],

  /**
   * Chart
   * @type {Object}
   * Required: name, value, year
   * Optional: average_value
   */
  charts: [{
    title: 'Lorem ipsum 1',
    query: 'SELECT a.nam_2 AS name, b.reven AS value, (SELECT AVG(reven) as average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year'
  }, {
    title: 'Lorem ipsum 2',
    query: 'SELECT a.nam_2 AS name, b.taxes AS value, (SELECT AVG(taxes) as average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year'
  }, {
    title: 'Lorem ipsum 3',
    query: 'SELECT a.nam_2 AS name, b.taxinc AS value, (SELECT AVG(taxinc) as average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year'
  }]

};
