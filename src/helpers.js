'use strict';

function formatNumber(num, dec) {
  dec = dec || dec === 0 ? dec : 1;

  let value = Number(num);

  if (isNaN(value) || value === null) {
    return num;
  }

  value = value.toFixed(~~dec);

  const factor = Math.pow(10, dec);
  const esp = /es/i.test(navigator.language);
  const regex = /(\d)(?=(?:\d{3})+$)/g;
  const tsep = esp ? '.' : ',';
  const dsep = esp ? ',' : '.';

  let parts = value.split('.');
  let fnums = parts[0];
  let decimals = parts[1] ? dsep + parts[1] : '';

  return fnums.replace(regex, '$1' + tsep) + decimals;
}

export default {
  formatNumber: formatNumber
};
