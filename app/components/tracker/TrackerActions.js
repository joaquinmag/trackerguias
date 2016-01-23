import {Dispatcher} from 'flux';
import {getXhrData, httpPost, httpPut, httpDel} from '../../services/fetcher';

const dispatcher = new Dispatcher();

dispatcher.transmit = function (actionType) {
  return function (text) {
    dispatcher.dispatch({
      actionType: actionType,
      text: text
    });
  };
};

export function trackerDispatcher() {
  return dispatcher;
};

export class TrackerActions {

  constructor() {
    this.LOOKUP_PACKAGE = 'lookup-package';
  }

  static lookupPackage(payload) {
    return httpPost('/tracker', payload, dispatcher.transmit(LOOKUP_PACKAGE));
  }

}
