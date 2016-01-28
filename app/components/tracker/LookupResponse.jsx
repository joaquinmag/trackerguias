'use strict';

import React from 'react';
import TrackerStore from './TrackerStore';
import {TrackerActions} from './TrackerActions';

export default React.createClass({
  displayName: 'LookupResponse',
  propTypes: {
    trackingStatus: React.PropTypes.array,
    show: React.PropTypes.bool,
    notFound: React.PropTypes.bool
  },
  getInitialState() {
    return {
      htmlResponse: null,
    };
  },
  render() {
    var self = this;
    console.log(JSON.stringify(self.props));
    if (self.props.show) {
      var notFound = function () {
        if (self.props.notFound) {
          return <div className="mdl-card__title"><h5 className="mdl-card__title-text">Paquete no encontrado</h5></div>;
        }
      }();
      var trackingStatus = function () {
        if (!self.props.notFound) {
          var json = JSON.stringify(self.props.trackingStatus);
          return <div className="section__text mdl-cell mdl-cell--12-col" dangerouslySetInnerHTML={{__html: json}}></div>;
        }
      }();
      return (
        <div className="mdl-card mdl-cell mdl-cell--12-col mdl-shadow--4dp">
          {notFound}
          {trackingStatus}
        </div>
      );
    }
    return <span></span>;
  },
});
