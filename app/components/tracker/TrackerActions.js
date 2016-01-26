import {Dispatcher} from 'flux';
import {httpPost} from '../../services/fetcher';

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
}

export class TrackerActions {

  static constants() {
    return Object.freeze({
      LOOKUP_PACKAGE: 'lookup-package'
    });
  }

  static lookupPackage(payload) {
    return httpPost('/tracker', payload, dispatcher.transmit(this.constants().LOOKUP_PACKAGE));
  }
}
