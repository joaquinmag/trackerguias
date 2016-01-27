import config from '../config/config.json';
//const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import when from 'when';
import easysoap from 'easysoap';
// headers: {
//   'SOAPAction': '#Oca_e_Pak/Tracking_Pieza'
// }

const clientParams = {
  'oca': {
    host: 'webservice.oca.com.ar',
    path: '/epak_tracking/Oep_TrackEPak.asmx',
    wsdl: '/epak_tracking/Oep_TrackEPak.asmx?WSDL'
  }
};

export default {
  trackPackage(courier, trackingData) {
    let soapClient = easysoap.createClient(clientParams[courier]);
    return when(soapClient.call({
       method    : 'Tracking_Pieza',
       attributes: {
           xmlns: '#Oca_e_Pak'
       },
       params: {
           Pieza: "1808200000003582106"
       }
    }));
  },
};
