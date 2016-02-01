import React from 'react';
import ReactDOM from 'react-dom';
import Tracker from '../components/tracker/Tracker.jsx';

let trackerGuias = window.trackerGuias || {};

trackerGuias.home = {
  render: function (couriers) {
    ReactDOM.render(<Tracker couriers={couriers} />, document.getElementById('home-container'));
  }
};

// TODO esto no deberia ser asi!
window.trackerGuias = trackerGuias;
