//import config from '../config/config.json';
//const trackingRepository = require('../data/' + config.db + '/persistence/trackingRepository');
import when from 'when';
import easysoap from 'easysoap';
import {stream} from '../util/logger';
import _ from 'lodash';
import moment from 'moment';
import {PackageNotFoundException, SoapConnectionError} from '../util/exceptions';
import emailManager from '../infraestructure/emailManager';

class OcaClient {

  constructor(settings) {
    this.settings = settings;
  }

  adaptOcaResult(data, trackingData) {
    stream.debug(JSON.stringify(data));
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
      stream.error(faultstring);
      throw new SoapConnectionError(faultstring);
    }

    let root = data.Tracking_PiezaResponse.Tracking_PiezaResult[1];
    if (!root.diffgram) {
      throw new PackageNotFoundException('Oca Package not found', trackingData);
    }
    return root.diffgram.NewDataSet.map((array) => {
      let estado = _.find(array.Table, (obj) => {
        return _.has(obj, 'Desdcripcion_Estado');
      }).Desdcripcion_Estado;
      let sucursal = _.find(array.Table, (obj) => {
        return _.has(obj, 'SUC');
      }).SUC;
      let date = _.find(array.Table, (obj) => {
        return _.has(obj, 'fecha');
      }).fecha;
      let motivo = _.find(array.Table, (obj) => {
        return _.has(obj, 'Descripcion_Motivo');
      }).Descripcion_Motivo;

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
      if (a.fecha.isAfter(b.fecha)) {
        returningValue = 1;
      } else if (a.fecha.isBefore(b.fecha)) {
        returningValue = -1;
      }
      return returningValue;
    });
  }

  webClient(trackingData) {
    let self = this;
    let packageId = trackingData.packageId;
    let soapClient = easysoap.createClient(self.settings);
    return soapClient.call({
      method: 'Tracking_Pieza',
      attributes: {
        xmlns: '#Oca_e_Pak'
      },
      params: {
        Pieza: packageId
      }
    }).then((result) => {
      if (!result) {
        throw new Error('result should be initialized');
      }
      return self.adaptOcaResult(result.data, packageId);
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
  },
  subscribeEmail(email, receiveMoreInfo, packageInformation) {
    packageInformation.toString = () => {
      return packageInformation.trackingData.packageId;
    };
    return this.trackPackage(packageInformation.courier, packageInformation.trackingData)
    .then((data) => {
      return emailManager.sendConfirmationEmail(email, packageInformation);
    });
  }
};
