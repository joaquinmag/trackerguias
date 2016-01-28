//import config from '../config/config.json';
//const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import when from 'when';
import easysoap from 'easysoap';
import {stream} from '../util/logger';
import _ from 'lodash';
import moment from 'moment';
import {PackageNotFoundException} from '../util/exceptions';

class OcaClient {

  constructor(settings) {
    this.settings = settings;
  }

  adaptOcaResult(data, trackingData) {
    stream.debug(JSON.stringify(data));
    let root = data.Tracking_PiezaResponse.Tracking_PiezaResult[1];
    if (!root.diffgram) {
      throw new PackageNotFoundException("Oca Package not found", trackingData);
    }
    return root.diffgram.NewDataSet.map((array) => {
      let estado = _.find(array.Table, (obj) => { return _.has(obj, 'Desdcripcion_Estado'); });
      let sucursal = _.find(array.Table, (obj) => { return _.has(obj, 'SUC'); });
      let date = _.find(array.Table, (obj) => { return _.has(obj, 'fecha'); });
      let motivo = _.find(array.Table, (obj) => { return _.has(obj, 'Descripcion_Motivo'); });

      if (date) {
        date = moment.parseZone(date);
      }

      return {
        'fecha': date,
        'estado': estado,
        'sucursal': sucursal,
        'motivo': motivo
      };
    }).sort((a, b) => {
      let returningValue = 0;
      if (a.isAfter(b)) {
        returningValue = 1;
      } else if (a.isBefore(b)) {
        returningValue = -1;
      }
      return returningValue;
    });
  }

  webClient(trackingData) {
    let self = this;
    let soapClient = easysoap.createClient(self.settings);
    return soapClient.call({
      method: 'Tracking_Pieza',
      attributes: {
        xmlns: '#Oca_e_Pak'
      },
      params: {
        Pieza: trackingData
      }
    }).then((result) => {
      if (!result) {
        throw new Error('result should be initialized');
      }
      return self.adaptOcaResult(result.data, trackingData);
    });
  }
}

const clientParams = [
  {
    courier: 'oca',
    callClient: new OcaClient({
      host: 'webservice.oca.com.ar',
      path: '/epak_tracking/Oep_TrackEPak.asmx',
      wsdl: '/epak_tracking/Oep_TrackEPak.asmx?WSDL'
    })
  }
];

export default {
  trackPackage(courier, trackingData) {
    let courierSettings = _.findWhere(clientParams, { 'courier': courier });
    if (!courierSettings) {
      throw new Error('courierSettings not available ');
    }
    stream.debug(`courierSettings: ${JSON.stringify(courierSettings)}`);
    return courierSettings.callClient.webClient(trackingData);
  }
};
