//import config from '../config/config.json';
//const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import when from 'when';
import easysoap from 'easysoap';
import {stream} from '../util/logger';
import _ from 'lodash';
// headers: {
//   'SOAPAction': '#Oca_e_Pak/Tracking_Pieza'
// }

const callSoapCourier = function (callSettings, trackingData) {
  let soapClient = easysoap.createClient(callSettings);
  return when.promise((resolve, reject) => {
    soapClient.call({
      method: 'Tracking_Pieza',
      attributes: {
        xmlns: '#Oca_e_Pak'
      },
      params: {
        Pieza: trackingData
      }
    })
    .then((result) => {
      if (!result) {
        reject(new Error("result should be initialized"));
      } else {
        resolve(result.data);
      }
    })
    .catch((err) => {
      reject(err);
    });
  });
};

const clientParams = [
  {
    courier: 'oca',
    callClient: callSoapCourier,
    params: {
      host: 'webservice.oca.com.ar',
      path: '/epak_tracking/Oep_TrackEPak.asmx',
      wsdl: '/epak_tracking/Oep_TrackEPak.asmx?WSDL'
    }
  }
];

export default {
  trackPackage(courier, trackingData) {
    let courierSettings = _.findWhere(clientParams, { 'courier': courier });
    if (!courierSettings) {
      throw new Error("courierSettings not available");
    }
    stream.debug(`courierSettings: ${JSON.stringify(courierSettings)}`);
    return courierSettings.callClient(courierSettings.params, trackingData);
  }
};
