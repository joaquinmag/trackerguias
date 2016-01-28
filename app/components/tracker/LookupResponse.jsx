'use strict';

import moment from 'moment';
import React from 'react';
import {TrackerActions} from './TrackerActions';

export default React.createClass({
  displayName: 'LookupResponse',
  propTypes: {
    trackingStatus: React.PropTypes.array,
    show: React.PropTypes.bool,
    notFound: React.PropTypes.bool
  },
  render() {
    var self = this;
    if (self.props.show) {
      var notFound = function () {
        if (self.props.notFound) {
          return <div className="mdl-card__title"><h5 className="mdl-card__title-text">Paquete no encontrado</h5></div>;
        }
      }();
      var trackingStatus = function () {
        if (!self.props.notFound) {
          var statusList = self.props.trackingStatus;
          return (
            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp full-width">
              <thead>
                <tr>
                  <th className="mdl-data-table__cell--non-numeric">Fecha y Hora</th>
                  <th className="mdl-data-table__cell--non-numeric full-width">Estado</th>
                  <th className="mdl-data-table__cell--non-numeric">Sucursal</th>
                  <th className="mdl-data-table__cell--non-numeric">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {
                  statusList.map(function (statusItem, i) {
                    var date = moment(statusItem.fecha).local().format('DD/MM/YYYY hh:mm:ss A');
                    return (
                      <tr key={i}>
                        <td className="mdl-data-table__cell--non-numeric">{date}</td>
                        <td className="mdl-data-table__cell--non-numeric">{statusItem.estado}</td>
                        <td className="mdl-data-table__cell--non-numeric">{statusItem.sucursal}</td>
                        <td className="mdl-data-table__cell--non-numeric">{statusItem.motivo}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          );
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
