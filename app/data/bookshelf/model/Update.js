import moment from 'moment';
import when from 'when';
let db;

export default class Update {

  static register(bookshelf) {
    db = bookshelf;
    bookshelf.models.Update = bookshelf.Model.extend({
      tableName: 'updates',
      idAttribute: 'id',
      tracking: function () {
        return this.belongsTo(bookshelf.models.Tracking, 'trackingId');
      }
    });
    bookshelf.models.Updates = bookshelf.Collection.extend({
      model: bookshelf.models.Update
    });
  }

  static saveUpdates(trackingId, trackingUpdates, transaction) {
    const dbUpdates = db.models.Update;
    const rightNow = moment().utc().format("YYYY-MM-DD HH:mm:ss");
    return when.map(trackingUpdates, (update) => {
      return dbUpdates.forge({
        fecha: update.fecha.utc().format("YYYY-MM-DD HH:mm:ss"),
        estado: update.estado,
        sucursal: update.sucursal,
        motivo: update.motivo,
        trackingId: trackingId,
        created: rightNow
      }).save(null, {transacting: transaction});
    });
  }

  static isTrackingExpired(dbUpdatesCollection) {
    if (!dbUpdatesCollection) {
      return true; // expires if no updates available
    }

    return dbUpdatesCollection.map((dbUpdate) => {
      return {
        fecha: moment(dbUpdate.get('fecha'))
      };
    })
    .sort((a, b) => { // desc order. first the newest
      let returningValue = 0;
      if (a.fecha.isAfter(b.fecha)) {
        returningValue = -1;
      } else if (a.fecha.isBefore(b.fecha)) {
        returningValue = 1;
      }
      return returningValue;
    })[0].fecha // get the first one
    .add(10, 'days') // expires after 10 days without updates
    .isBefore(moment());
  }
}
