//import config from '../config/config.json';
//const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import easysoap from 'easysoap';
import {stream} from '../util/logger';
import _ from 'lodash';
import when from 'when';
import {PackageNotFoundException, SoapConnectionError} from '../util/exceptions';
import emailManager from '../infrastructure/emailManager';
import Courier from '../data/bookshelf/model/Courier';

export default {
  trackPackage(courierName, trackingData) {
    const courier = Courier.buildCourier(courierName);
    stream.debug(`courier built for name: ${courierName}`);
    return courier.callClient(easysoap, trackingData)
      .then((data) => {
        stream.debug("data received from client called.");
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
        if (!root.diffgram) {
          return when.reject(new PackageNotFoundException('Oca Package not found', trackingData));
        }
        return courier.adaptResult(root);
      });
  },
  subscribeEmail(email, receiveMoreInfo, packageInformation) {
    packageInformation.toString = () => {
      return packageInformation.trackingData.packageId;
    };
    return this.trackPackage(packageInformation.courier, packageInformation.trackingData)
    .then(() => {
      return emailManager.sendConfirmationEmail(email, packageInformation);
    });
  }
};
