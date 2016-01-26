import { trackerDispatcher, TrackerActions } from './TrackerActions';
import assign from 'object-assign';
import {EventEmitter} from 'events';

let selfTracking;

const TrackerStore = assign({}, EventEmitter.prototype, {
  saveTracking: function (tracking) {
    selfTracking = {
      tracking: tracking
    };
  },

  getTracking: function () {
    return selfTracking;
  },

  emitChange: function (actionType) {
    this.emit(actionType);
  },

  addChangeListener: function (event, callback) {
    this.on(event, callback);
  },

  removeChangeListener: function (event, callback) {
    this.removeListener(event, callback);
  }
});

// Register callback to handle all updates
trackerDispatcher().register(function (data) {
  switch (data.actionType) {
    case TrackerActions.constants().LOOKUP_PACKAGE:
      TrackerStore.saveTracking(data.text.htmlResponse);
      break;
    default:
    // no op
  }
  TrackerStore.emitChange(data.actionType);
});

export default TrackerStore;
