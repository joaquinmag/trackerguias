//import config from '../config/config.json';
//const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import easysoap from 'easysoap';
import {stream} from '../util/logger';
import _ from 'lodash';
import when from 'when';
import {PackageNotFoundException, SoapConnectionError} from '../util/exceptions';
import EmailManager from '../infrastructure/emailManager';
import CryptoManager from '../infrastructure/cryptoManager';
import Courier from '../data/bookshelf/model/Courier';
import Tracking from '../data/bookshelf/model/Tracking';

export default {
  trackPackage(courierName, trackingData) {
    const courier = Courier.buildCourier(courierName);
    stream.debug(`courier built for name: ${courierName}`);
    return courier.callClient(easysoap, trackingData)
      .then((data) => {
        stream.debug('data received from client called.');
        if (data && data.Fault) {
          const faultstring = (function () {
            const faultData = _.find(data.Fault, (obj) => {
              return _.has(obj, 'faultstring');
            });
            if (faultData) {
              return `Soap fault with faultstring: ${faultData.faultstring}`;
            }
            return 'Soap Fault with no faultstring available';
          }());
          stream.error(JSON.stringify(faultstring));
          return when.reject(new SoapConnectionError(faultstring));
        }

        const root = data.Tracking_PiezaResponse.Tracking_PiezaResult[1];
        stream.debug(`tracking information to parse: ${JSON.stringify(root)}`);
        if (!root.diffgram) {
          return when.reject(new PackageNotFoundException('Oca Package not found', trackingData));
        }
        return courier.adaptResult(root);
      });
  },
  subscribeEmail(email, receiveMoreInfo, packageInformation) {
    return this.trackPackage(packageInformation.courier, packageInformation.trackingData)
    .then(() => {

      let cryptoManager = new CryptoManager();
      const encryptedData = cryptoManager.encrypt(JSON.stringify({
        email: email,
        receiveMoreInfo: receiveMoreInfo,
        packageInformation: packageInformation
      }));

      const emailManager = new EmailManager();
      return emailManager.sendConfirmationEmail(email, packageInformation, encryptedData);
    });
  },
  confirmSubscription(email, receiveMoreInfo, packageInformation) {
    return Tracking.save({
      email: email,
      receiveMoreInfo: receiveMoreInfo,
      courier: packageInformation.courier,
      trackingData: packageInformation.trackingData
    })
    .then(() => {
      return Courier.buildCourier(packageInformation.courier)
        .readableTrackingData(packageInformation.trackingData);
    });
  }
};
