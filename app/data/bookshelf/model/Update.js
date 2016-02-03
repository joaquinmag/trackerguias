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
    const rightNow = moment().utc().format();
    return when.map(trackingUpdates, (update) => {
      return dbUpdates.forge({
        fecha: update.fecha.utc().format(),
        estado: update.estado,
        sucursal: update.sucursal,
        motivo: update.motivo,
        trackingId: trackingId,
        created: rightNow
      }).save(null, {transacting: transaction});
    });
  }
}
