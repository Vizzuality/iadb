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
    query_total: 'SELECT a.name AS name, b.${columnName} as average_value, (SELECT round(AVG(${columnName})::numeric,2) as nat_average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year) FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' AND year=${year}',
    query_perc:'with r as (SELECT sum(p2000) p2000, sum(p2001) p2001,sum(p2002) p2002, sum(p2003) p2003, sum(p2004) p2004, sum(p2005) p2005, sum(p2006) p2006, sum(p2007) p2007, sum(p2008) p2008, sum(p2009) p2009, sum(p2010) p2010, sum(p2011) p2011, sum(p2012) p2012 FROM table_2bra_seriepob),  s as (select 2000 as year, p2000 as value from r union select 2001 as year, p2001 as value from r union select 2002 as year, p2002 as value from r union select 2003 as year, p2003 as value from r union select 2004 as year, p2004 as value from r union select 2005 as year, p2005 as value from r union select 2006 as year, p2006 as value from r union select 2007 as year, p2007 as value from r union select 2008 as year, p2008 as value from r union select 2009 as year, p2009 as value from r union select 2010 as year, p2010 as value from r union select 2011 as year, p2011 as value from r union select 2012 as year, p2012 as value from r order by year asc), t as (select sum(reven)*1000000 as reven_total, year  from table_3fiscal_primera_serie group by year)   SELECT a.name AS name, round(b.${columnName}::numeric,2) as average_value, round((t.reven_total/s.value)::numeric,2) as nat_average_value, b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join s on b.year=s.year join t on b.year=t.year WHERE a.codgov=\'${codgov}\' and b.year=${year}'
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
    name: 'Total',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'reven',
    buckets: 7,
    query: 'SELECT a.*, b.reven FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,reven, name',
    unit: 'M R$',
    categoryName:'Revenue',
    total: true
  }, {
    name: 'Per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'reven_rate',
    buckets: 7,
    query: 'SELECT a.*, (b.reven*1000000/c.p${year}) as reven_rate FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join table_2bra_seriepob c on a.codgov=c.codgov WHERE year=${year} and c.p${year} !=0 ',
    interactivity: 'codgov, reven_rate, name',
    unit: 'R$',
    categoryName:'Revenue'
    ,
    total: false
  }, {
    name: 'Total',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxes',
    buckets: 7,
    query: 'SELECT a.*, b.taxes FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,taxes, name',
    unit: 'M R$',
    categoryName: 'Taxes',
    total: true
  },
  {
    name: 'Per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'tax_rate',
    buckets: 7,
    query: 'SELECT a.*, ( b.taxes*1000000/c.p${year} ) as tax_rate FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join table_2bra_seriepob c on a.codgov=c.codgov WHERE year=${year} and c.p${year} !=0 ',
    interactivity: 'codgov,tax_rate, name',
    unit: 'R$',
    categoryName:'Taxes',
    total: false
  }, {
    name: 'Total',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxinc',
    buckets: 7,
    query: 'SELECT a.*, b.taxinc FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE year=${year}',
    interactivity: 'codgov,taxinc, name',
    unit: 'M R$',
    categoryName: 'Tax. Inc.',
    total: true
  },
  {
    name: 'Per capita',
    tableName: 'table_3fiscal_primera_serie',
    columnName: 'taxinc_rate',
    buckets: 7,
    query: 'SELECT a.*, ( b.taxinc*1000000/c.p${year} ) as taxinc_rate FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join table_2bra_seriepob c on a.codgov=c.codgov WHERE year=${year} and c.p${year} !=0',
    interactivity: 'codgov,taxinc_rate, name',
    unit: 'R$',
    categoryName: 'Tax. Inc.',
    total: false
  },],

  /**
   * Chart
   * @type {Object}
   * Required: name, value, year
   * Optional: average_value
   */
  charts: [{
    title: 'Total',
    query: 'SELECT a.name AS name, b.reven as average_value, (SELECT AVG(reven) as nat_average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year',
    columnName:'reven',
    unit: 'M R$',
    total: true

  },{
    title: 'Per capita',
    query: 'with r as (SELECT sum(p2000) p2000, sum(p2001) p2001,sum(p2002) p2002, sum(p2003) p2003, sum(p2004) p2004, sum(p2005) p2005, sum(p2006) p2006, sum(p2007) p2007, sum(p2008) p2008, sum(p2009) p2009, sum(p2010) p2010, sum(p2011) p2011, sum(p2012) p2012 FROM table_2bra_seriepob),  s as (select 2000 as year, p2000 as value from r union select 2001 as year, p2001 as value from r union select 2002 as year, p2002 as value from r union select 2003 as year, p2003 as value from r union select 2004 as year, p2004 as value from r union select 2005 as year, p2005 as value from r union select 2006 as year, p2006 as value from r union select 2007 as year, p2007 as value from r union select 2008 as year, p2008 as value from r union select 2009 as year, p2009 as value from r union select 2010 as year, p2010 as value from r union select 2011 as year, p2011 as value from r union select 2012 as year, p2012 as value from r order by year asc), t as (select sum(reven)*1000000 as reven_total, year  from table_3fiscal_primera_serie group by year)   SELECT a.name AS name, round(b.reven_rate::numeric,2) as average_value, round((t.reven_total/s.value)::numeric,2) as nat_average_value, b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join s on b.year=s.year join t on b.year=t.year WHERE a.codgov=\'${codgov}\'  ORDER BY b.year',
    columnName:'reven_rate',
    unit: 'R$',
    total: false
  },  {
    title: 'Total',
    query: 'SELECT a.name AS name, b.taxes AS average_value, (SELECT AVG(taxes) as nat_average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year',
    columnName:'taxes',
    unit: 'M R$',
    total: true
  },{
    title: 'Per capita',
    query: 'with r as (SELECT sum(p2000) p2000, sum(p2001) p2001,sum(p2002) p2002, sum(p2003) p2003, sum(p2004) p2004, sum(p2005) p2005, sum(p2006) p2006, sum(p2007) p2007, sum(p2008) p2008, sum(p2009) p2009, sum(p2010) p2010, sum(p2011) p2011, sum(p2012) p2012 FROM table_2bra_seriepob),  s as (select 2000 as year, p2000 as value from r union select 2001 as year, p2001 as value from r union select 2002 as year, p2002 as value from r union select 2003 as year, p2003 as value from r union select 2004 as year, p2004 as value from r union select 2005 as year, p2005 as value from r union select 2006 as year, p2006 as value from r union select 2007 as year, p2007 as value from r union select 2008 as year, p2008 as value from r union select 2009 as year, p2009 as value from r union select 2010 as year, p2010 as value from r union select 2011 as year, p2011 as value from r union select 2012 as year, p2012 as value from r order by year asc), t as (select sum(taxes)*1000000 as tax_total, year  from table_3fiscal_primera_serie group by year)   SELECT a.name AS name, round(b.tax_rate::numeric,2) as average_value, round((t.tax_total/s.value)::numeric,2) as nat_average_value, b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join s on b.year=s.year join t on b.year=t.year WHERE a.codgov=\'${codgov}\'  ORDER BY b.year',
    columnName:'tax_rate',
    unit: 'R$',
    total: false
  },  {
    title: 'Total',
    query: 'SELECT a.name AS name, b.taxinc AS average_value, (SELECT AVG(taxinc) as nat_average_value FROM table_3fiscal_primera_serie WHERE year=b.year GROUP BY year), b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov WHERE a.codgov=\'${codgov}\' ORDER BY b.year',
    columnName:'taxinc',
    unit: 'M R$',
    total: true
  },{
    title: 'Per capita',
    query: 'with r as (SELECT sum(p2000) p2000, sum(p2001) p2001,sum(p2002) p2002, sum(p2003) p2003, sum(p2004) p2004, sum(p2005) p2005, sum(p2006) p2006, sum(p2007) p2007, sum(p2008) p2008, sum(p2009) p2009, sum(p2010) p2010, sum(p2011) p2011, sum(p2012) p2012 FROM table_2bra_seriepob),  s as (select 2000 as year, p2000 as value from r union select 2001 as year, p2001 as value from r union select 2002 as year, p2002 as value from r union select 2003 as year, p2003 as value from r union select 2004 as year, p2004 as value from r union select 2005 as year, p2005 as value from r union select 2006 as year, p2006 as value from r union select 2007 as year, p2007 as value from r union select 2008 as year, p2008 as value from r union select 2009 as year, p2009 as value from r union select 2010 as year, p2010 as value from r union select 2011 as year, p2011 as value from r union select 2012 as year, p2012 as value from r order by year asc), t as (select sum(taxinc)*1000000 as taxinc_total, year  from table_3fiscal_primera_serie group by year)   SELECT a.name AS name, round(b.taxinc_rate::numeric,2) as average_value, round((t.taxinc_total/s.value)::numeric,2) as nat_average_value, b.year FROM bra_poladm2 a JOIN table_3fiscal_primera_serie b ON a.codgov::integer=b.codgov join s on b.year=s.year join t on b.year=t.year WHERE a.codgov=\'${codgov}\'  ORDER BY b.year',
    columnName:'taxinc_rate',
    unit: 'R$',
    total: false
  }]

};
