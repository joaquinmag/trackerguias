import when from 'when';
import guard from 'when/guard';
import parallel from 'when/parallel';
import {stream} from '../util/logger';
import Tracking from '../data/bookshelf/model/Tracking';
import trackingService from '../services/trackingService';

const minuteInMillis = 60 * 1000;

function checkForChangesAndNotify(tracking) {
  stream.debug(JSON.stringify(tracking));
  return when.join(
    trackingService.trackPackage(tracking.get("courier"), JSON.parse(tracking.get("trackingData"))),
    tracking.related('updates').fetch()
  )
  .then((joinedData) => {
    const newTrackingUpdates = joinedData[0];
    const lastTrackingUpdates = joinedData[1];
    stream.debug(JSON.stringify(newTrackingUpdates));
    stream.debug(JSON.stringify(lastTrackingUpdates));

    return when.resolve();
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
