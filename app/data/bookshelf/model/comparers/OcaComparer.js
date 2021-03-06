import moment from 'moment';
import {stream} from '../../../../util/logger';

export default class OcaComparer {

  constructor(dbTracking) {
    this.tracking = dbTracking; // is a bookshelf model of tracking
    // TODO related updates should be already fetched
  }

  diffUpdates(newUpdatesFromServer) {
    const self = this;

    function fechaSort(a, b) { // desc order. first the newest
      let returningValue = 0;
      if (a.fecha.isAfter(b.fecha)) {
        returningValue = -1;
      } else if (a.fecha.isBefore(b.fecha)) {
        returningValue = 1;
      }
      return returningValue;
    }

    const normalizedOldUpdates = self.tracking.related('updates').map((trackingUpdate) => {
      return {
        fecha: moment.utc(trackingUpdate.get('fecha')),
        estado: trackingUpdate.get('estado'),
        sucursal: trackingUpdate.get('sucursal'),
        motivo: trackingUpdate.get('motivo')
      };
    }).sort(fechaSort);
    const normalizedNewUpdates = newUpdatesFromServer.map((trackingUpdate) => {
      return {
        fecha: moment(trackingUpdate.fecha),
        estado: trackingUpdate.estado,
        sucursal: trackingUpdate.sucursal,
        motivo: trackingUpdate.motivo
      };
    });

    const lastDate = normalizedOldUpdates[0].fecha;
    const lastDateUpdates = normalizedOldUpdates.filter((update) => {
      return update.fecha.isSame(lastDate);
    });
    return normalizedNewUpdates.filter((update) => {
      if (update.fecha.isAfter(lastDate)) {
        return true;
      } else if (update.fecha.isSame(lastDate)) {
        stream.debug(`update: ${update.fecha}, lastDate: ${lastDate}`);
        return !lastDateUpdates.find((lastDateUpdate) => {
          return update.estado === lastDateUpdate.estado &&
            update.sucursal === lastDateUpdate.sucursal &&
            update.motivo === lastDateUpdate.motivo;
        });
      }
      return false;
    });
  }

}
