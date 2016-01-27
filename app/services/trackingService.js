import config from '../config/config.json';
const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import easysoap from 'easysoap';

const clientParams = {
  'oca': {
    host: 'webservice.oca.com.ar',
    path: '/epak_tracking/Oep_TrackEPak.asmx',
    wsdl: '/epak_tracking/Oep_TrackEPak.asmx?WSDL'
  }
};

export default {
  trackPackage(courier, trackingData) {
    let soapParams = clientParams[courier];{

       headers: [{
           'name'     : 'item_name',
           'value'    : 'item_value',
           'namespace': 'item_namespace'
       }]
   };
  },
};
