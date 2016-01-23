import { trackerDispatcher, TrackerActions } from './TrackerActions';
import _ from 'lodash';
import assign from 'object-assign';
import {EventEmitter} from 'events';

let tracking;

function changeLookup(response) {
  tracking = response.data;
}


const TrackerStore = assign({}, EventEmitter.prototype, {
  getData: function () {
    return {
      data: things,
      metadata: metadata
    };
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
trackerDispatcher().register(function (action) {
  switch (action.actionType) {
    case TrackerActions.LOOKUP_PACKAGE:
      changeLookup(action.text);
      break;

    default:
    // no op
  }
  TrackerStore.emitChange(action.actionType);
});

export default TrackerStore;
