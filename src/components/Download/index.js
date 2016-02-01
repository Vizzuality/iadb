'use strict';

import './style.css';
import React from 'react';
import moment from 'moment';

function base64(s) {
  return window.btoa(window.unescape(encodeURIComponent(s)));
}

class Download extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
      layerName: props.layerName,
      codgov: props.codgov
    };
  }

  shouldComponentUpdate(prevState) {
    return !!!(prevState.query);
  }

  downloadData() {
    const username = this.props.cartodbUser;
    const sql = this.state.query
      .replace(/\$\{columnName\}/g, this.state.layerName)
      .replace(/\$\{codgov\}/g, this.state.codgov);
    const url = `https:\/\/${username}.cartodb.com/api/v2/sql?q=${sql}&format=CSV`;
    const link = document.createElement('a');
    const strMime = 'application/octet-stream';
    const datetime = moment().format('YYYY-MM-DD_HH:mm');
    const fileName = `${this.state.layerName}_${datetime}.csv`;

    $.get(url, (str) => {
      if (navigator.msSaveBlob) {
        const blob = new Blob([str], { type: strMime });
        navigator.msSaveBlob(blob, fileName);
      } else {
        link.setAttribute('download', fileName);
        link.href = 'data:' + strMime + ';charset=utf-8;base64,' + base64(str);
        document.body.appendChild(link);
        link.click(); //Dispatching click event.
        document.body.removeChild(link);
      }
    }).fail((err) => {
      throw err.responseText;
    });
  }

  render() {
    if (!this.state.query) {
      return null;
    }
    return (
      <div className="download">
        <button
          className="download-btn"
          onClick={this.downloadData.bind(this)}>Download data</button>
      </div>
    );
  }

}

export default Download;
