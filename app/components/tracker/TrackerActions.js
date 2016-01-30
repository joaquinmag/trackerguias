import {httpPost} from '../../services/fetcher';

export class TrackerActions {

  static lookupPackage(payload) {
    return httpPost('/tracker', payload);
  }

  static subscribeEmail(payload) {
    return httpPost('/subscribe', payload);
  }
}
