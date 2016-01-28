//import config from '../config/config.json';
//const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import when from 'when';
import easysoap from 'easysoap';
import {stream} from '../util/logger';
import _ from 'lodash';
import moment from 'moment';

const adaptOcaResult = function (data) {
  return data.diffgram.NewDataSet.map((array) => {
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
    if (a.isSame(b)) {
      return 0;
    } else if (a.isBefore(b)) {
      return -1;
    } else {
      return 1;
    }
  });
};

const ocaSoapClient = function (callSettings, trackingData) {
  let soapClient = easysoap.createClient(callSettings);
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
      throw new Error("result should be initialized");
    }
    return adaptOcaResult(result.data);
  });
};

const clientParams = [
  {
    courier: 'oca',
    callClient: ocaSoapClient,
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
