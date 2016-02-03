import when from 'when';
import guard from 'when/guard';
import parallel from 'when/parallel';
import {stream} from '../util/logger';
import Tracking from '../data/bookshelf/model/Tracking';
import Update from '../data/bookshelf/model/Tracking';
import trackingService from '../services/trackingService';
import EmailManager from './emailManager';

const minuteInMillis = 60 * 1000;

function checkForChangesAndNotify(tracking) {
  return trackingService.trackPackage(tracking.get('courier'), JSON.parse(tracking.get('trackingData')))
  .then((newTrackingUpdates) => {
    return Tracking.updateWithNewUpdates(tracking, newTrackingUpdates);
  })
  .then((differences) => {
    stream.debug(`this are the differences for ${tracking.get('trackingData')} : ${JSON.stringify(differences)}`);
    const emailManager = new EmailManager();
    return emailManager.sendNewDifferences(tracking.get('email'), JSON.parse(tracking.get('trackingData')), differences);
  })
  .catch((err) => {
    if (err.code && (err.code === 'EXPIRED' || err.code === 'NO_DIFF')) {
      stream.debug(`error catched, ${err}`);
      if (err.code == 'EXPIRED') {
        stream.info(`tracking expired, ${tracking.get('trackingData')}`);
      }
    }
  });
}

export default function () {
  setInterval(() => {
    stream.info('starting changes checker interval');

    Tracking.fetchNonExpired()
    .then((trackings) => {
      // only 5 tasks in parallel
      const guardTasks = guard.bind(null, guard.n(5));

      // create tasks for each tracking
      const tasks = trackings.map((tracking) => {
        return checkForChangesAndNotify.bind(null, tracking);
      }).map(guardTasks);

      // parallelize tasks
      return parallel(tasks);
    })
    .then((results) => {
      stream.info(`finished checking ${results.length}`);
    })
    .catch((err) => {
      stream.error(`error checking changes ${err}, ${JSON.stringify(err)}`);
    });

    stream.info('finishing changes checker interval');
  }, 30*1000);
}
