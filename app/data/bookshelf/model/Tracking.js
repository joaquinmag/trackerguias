import moment from 'moment';

let db;

export default class Tracking {

  static register(bookshelf) {
    db = bookshelf;
    bookshelf.models.Tracking = bookshelf.Model.extend({
      tableName: 'trackings',
      idAttribute: 'id',
      updates: function () {
        return this.hasMany(bookshelf.models.Update, 'trackingId');
      }
    });
    bookshelf.models.Trackings = bookshelf.Collection.extend({
      model: bookshelf.models.Tracking
    });
  }

  static fetchNonExpired() {
    const dbTracking = new db.models.Trackings();
    return dbTracking.query({
      where: {
        'expired': false
      }
    })
    .fetch();
  }

  static startTransaction(transactionCallback) {
    return db.transaction(transactionCallback);
  }

  static save(followTrackingData, transaction) {
    const dbTracking = db.models.Tracking;
    if (followTrackingData.id) { // update
      return dbTracking.forge({id: followTrackingData.id})
      .fetch({require: true})
      .then(function (tracking) {
        return tracking.set({
          courier: followTrackingData.courier,
          email: followTrackingData.email,
          marketing: followTrackingData.receiveMoreInfo,
          expired: followTrackingData.expired,
          trackingData: JSON.stringify(followTrackingData.trackingData),
          updated: moment().utc().format()
        }).save(null, {transacting: transaction});
      })
      .then((savedTracking) => {
        followTrackingData.updated = savedTracking.get('updated');
        return followTrackingData;
      });
    }

    // create new one
    const rightNow = moment().utc().format();
    return dbTracking.forge({
      courier: followTrackingData.courier,
      email: followTrackingData.email,
      marketing: followTrackingData.receiveMoreInfo,
      expired: false,
      trackingData: JSON.stringify(followTrackingData.trackingData),
      updated: rightNow,
      created: rightNow
    }).save()
    .then((savedTracking) => {
      followTrackingData.id = savedTracking.get('id');
      followTrackingData.updated = savedTracking.get('updated');
      followTrackingData.created = savedTracking.get('created');
      followTrackingData.expired = savedTracking.get('expired');
      return followTrackingData;
    });
  }

}
