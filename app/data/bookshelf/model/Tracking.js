import when from 'when';
import moment from 'moment';
import Update from './Update';
import OcaComparer from './comparers/OcaComparer';
import {stream} from '../../../util/logger';
import {ExpiredTrackingException, NoDifferencesException} from '../../../util/exceptions';

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

  static updateWithNewUpdates(tracking, newUpdates) {
    return tracking.related('updates').fetch()
    .then((oldUpdates) => {
      const differences = Tracking
        .buildUpdatesComparer(tracking)
        .diffUpdates(newUpdates);

      if (differences.length === 0) {
        stream.debug(`Inside no differences for ${tracking.get('trackingData')}`);
        if (Update.isTrackingExpired(oldUpdates)) {
          return tracking.set({
            expired: true,
            updated: moment().utc().format()
          }).save()
          .then(() => {
            return when.reject(new ExpiredTrackingException());
          });
        }
        return when.reject(new NoDifferencesException());
      }

      return Tracking.startTransaction((transaction) => {
        return Update
          .saveUpdates(tracking.get('id'), differences, transaction)
          .then(() => {
            return tracking.set({
              updated: moment().utc().format()
            }).save(null, {transacting: transaction});
          });
      })
      .then(() => {
        return differences;
      });
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
    }).save(null, {transacting: transaction})
    .then((savedTracking) => {
      followTrackingData.id = savedTracking.get('id');
      followTrackingData.updated = savedTracking.get('updated');
      followTrackingData.created = savedTracking.get('created');
      followTrackingData.expired = savedTracking.get('expired');
      return followTrackingData;
    });
  }

  static buildUpdatesComparer(tracking) {
    // TODO tracking is a bookshelf model, check it
    const courierName = tracking.get('courier');
    switch (courierName) {
      case 'oca':
        return new OcaComparer(tracking);
      default:
        throw new Error(`courierName ${courierName} not identified when building UpdatesComparer`);
    }
  }

}
