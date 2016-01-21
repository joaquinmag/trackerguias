import React from 'react';
import ReactDOM from 'react-dom';
import Lookup from '../components/tracker/Lookup.jsx';

let trackerGuias = window.trackerGuias || {};

trackerGuias.home = {
  render: function () {
    ReactDOM.render(<Lookup />, document.getElementById('checkPackage'));
  }
};

// TODO esto no deberia ser asi!
window.trackerGuias = trackerGuias;
