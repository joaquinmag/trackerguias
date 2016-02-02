import moment from 'moment';
import when from 'when';

let db;

export default class Tracking {

  static register(bookshelf) {
    db = bookshelf;
    bookshelf.models.Tracking = bookshelf.Model.extend({
      tableName: 'trackings',
      idAttribute: 'id'
    });
    bookshelf.models.Trackings = bookshelf.Collection.extend({
      model: bookshelf.models.Tracking
    });
  }

  static save(followTrackingData) {
    const dbTracking = db.models.Tracking;
    if (followTrackingData.id) { // update
      return dbTracking.forge({id: followTrackingData.id})
      .fetch({require: true})
      .then(function (tracking) {
        return tracking.set({
          courier: followTrackingData.courier,
          email: followTrackingData.email,
          marketing: followTrackingData.receiveMoreInfo,
          trackingData: JSON.stringify(followTrackingData.trackingData),
          updated: moment().utc().format()
        }).save();
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
      trackingData: JSON.stringify(followTrackingData.trackingData),
      updated: rightNow,
      created: rightNow
    }).save()
    .then((savedTracking) => {
      followTrackingData.updated = savedTracking.get('updated');
      followTrackingData.created = savedTracking.get('created');
      return followTrackingData;
    });
  }

}
