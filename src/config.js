export default {

  cartodb_username: 'iadb',

  /**
   * Map configuration
   * @type {Object}
   */
  map: {
    // More info: [http://leafletjs.com/reference.html#map-options]
    options: {
      zoom: 5,
      center: [-16.78350556192777, -54.0087890625]
    },
    // Basemap url
    basemap: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  },

  /**
   * Timeline configuration
   * @type {Object}
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
    pause: 3000
  },

  /**
   * Layers configuration
   * @type {Object}
   */
  layers: {
    multiple: false,
    data: [
      {
        "name": "Reven",
        "table_name": "table_3fiscal_primera_serie",
        "column_name": "reven",
        "buckets": 7,
        "query": "SELECT a.*, b.reven, b.taxes, b.taxinc FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}",
        "interactivity": "reven",
        "active": true
      }, {
        "name": "Taxes",
        "table_name": "table_3fiscal_primera_serie",
        "column_name": "taxes",
        "buckets": 7,
        "query": "SELECT a.*, b.reven, b.taxes, b.taxinc FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}",
        "interactivity": "taxes",
        "active": false
      }, {
        "name": "Tax. Inc.",
        "table_name": "table_3fiscal_primera_serie",
        "column_name": "taxinc",
        "buckets": 7,
        "query": "SELECT a.*, b.reven, b.taxes, b.taxinc FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}",
        "interactivity": "taxinc",
        "active": false
      }
    ]
  }

};
