'use strict';

import React from 'react';
import TrackerStore from './TrackerStore';
import {TrackerActions} from './TrackerActions';

export default React.createClass({
  displayName: 'LookupResponse',
  propTypes: {
    trackingStatus: React.PropTypes.array.isRequired,
    show: React.PropTypes.bool.isRequired,
    notFound: React.PropTypes.bool.isRequired
  },
  getInitialState() {
    return {
      htmlResponse: null,
    };
  },
  render() {
    var self = this;
    if (self.props.show) {
      var notFound = function () {
        if (self.props.notFound) {
          return <div className="section__title mdl-cell mdl-cell--12-col"><h4>Paquete no encontrado</h4></div>;
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
  componentDidMount: function() {
    componentHandler.upgradeDom();
  },
  componentDidUpdate() {
    componentHandler.upgradeDom();
  }
});
