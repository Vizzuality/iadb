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
    query: 'SELECT a.nam_2 AS name, round(AVG(b.${columnName})::numeric,2) AS average_value FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' AND year=${year} GROUP BY a.nam_2'
  },

  /**
   * Map configuration
   * @type {Object}
   */
  map: {
    // More info: [http://leafletjs.com/reference.html#map-options]
    mapOptions: {
      zoom: 5,
      center: [-13.752724664396975,-48.1201171875]
    },
    // Basemap url
    basemap: 'https://a.tiles.mapbox.com/v4/aliciarenzana.2bebf2c6/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiYWxpY2lhcmVuemFuYSIsImEiOiJjOTQ2OThkM2VkY2I5MjYwNTUyNmIyMmEyZWFmOGZjMyJ9.sa4f1HalXYr3GYTRAsdnzA',
    // Legend colors
    colors: ['#F8D368','#F5E8B7', '#D3E0E5', '#AEC7D5', '#5285A1', '#084769', '#062B3F']
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
    name: 'Revenue',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'reven',
    buckets: 7,
    query: 'SELECT a.*, b.reven FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,reven',
    unit: 'M R$'
  }, {
    name: 'Revenue per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'reven_rate',
    buckets: 7,
    query: 'SELECT a.*, (b.reven*1000000/c.p${year}) as reven_rate FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join table_2bra_seriepob c on a.codgov=c.codgov WHERE year=${year} ',
    interactivity: 'codgov, reven_rate',
    unit: 'R$'
  }, {
    name: 'Taxes',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxes',
    buckets: 7,
    query: 'SELECT a.*, b.taxes FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,taxes',
    unit: 'M R$'
  },
  {
    name: 'Taxes per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'tax_rate',
    buckets: 7,
    query: 'SELECT a.*, ( b.taxes*1000000/c.p${year} ) as tax_rate FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join table_2bra_seriepob c on a.codgov=c.codgov WHERE year=${year} ',
    interactivity: 'codgov,tax_rate',
    unit: 'R$'
  }, {
    name: 'Tax. Inc.',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxinc',
    buckets: 7,
    query: 'SELECT a.*, b.taxinc FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,taxinc',
    unit: 'M R$'
  },
  {
    name: 'Tax. Inc. per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxinc_rate',
    buckets: 7,
    query: 'SELECT a.*, ( b.taxinc*1000000/c.p${year} ) as taxinc_rate FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join table_2bra_seriepob c on a.codgov=c.codgov WHERE year=${year} ',
    interactivity: 'codgov,taxinc_rate',
    unit: 'R$'
  },],

  /**
   * Chart
   * @type {Object}
   * Required: name, value, year
   * Optional: average_value
   */
  charts: [{
    title: 'Revenue',
    query: 'SELECT a.nam_2 AS name, b.reven AS value, (SELECT AVG(reven) as average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year',
    unit: 'M R$'
  },  {
    title: 'Taxes',
    query: 'SELECT a.nam_2 AS name, b.taxes AS value, (SELECT AVG(taxes) as average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year',
    unit: 'M R$'
  },  {
    title: 'Tax. Inc.',
    query: 'SELECT a.nam_2 AS name, b.taxinc AS value, (SELECT AVG(taxinc) as average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year',
    unit: 'M R$'
  }]

};
