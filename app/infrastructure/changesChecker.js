import guard from 'when/guard';
import parallel from 'when/parallel';
import {stream} from '../util/logger';
import Tracking from '../data/bookshelf/model/Tracking';
import trackingService from '../services/trackingService';
import EmailManager from './emailManager';
import {ExpiredTrackingException, NoDifferencesException} from '../util/exceptions';

const minuteInMillis = 60 * 1000;

function checkForChangesAndNotify(tracking) {
  return trackingService.trackPackage(
    tracking.get('courier'),
    JSON.parse(tracking.get('trackingData'))
  ).then((newTrackingUpdates) => {
    return Tracking.updateWithNewUpdates(tracking, newTrackingUpdates);
  })
  .then((differences) => {
    stream.debug(`${tracking.get('trackingData')} diff: ${JSON.stringify(differences)}`);
    const emailManager = new EmailManager();
    return emailManager.sendNewDifferences(
        tracking.get('email'),
        tracking.get('courier'),
        JSON.parse(tracking.get('trackingData')),
        differences);
  })
  .catch((err) => {
    if (err instanceof NoDifferencesException) {
      stream.debug(`NoDifferencesException caught, ${err}`);
      return;
    } else if (err instanceof ExpiredTrackingException) {
      stream.info(`tracking expired, ${tracking.get('trackingData')}`);
      return;
    }
    throw err;
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
      stream.error(`error checking changes ${err}`);
    });

    stream.info('finishing changes checker interval');
  }, 30* 1000);
}
