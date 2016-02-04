import _ from 'lodash';
import moment from 'moment';
import {stream} from '../../../util/logger';
import when from 'when';
import {CourierNotFoundException, WrongTrackingDataException} from '../../../util/exceptions';
import nodeValidator from 'validator';

class Oca {
  constructor() {
    this.courier = 'oca';
    this.host = 'webservice.oca.com.ar';
    this.path = '/epak_tracking/Oep_TrackEPak.asmx';
    this.wsdl = '/epak_tracking/Oep_TrackEPak.asmx?WSDL';
  }

  adaptResult(data) {
    const packageHistory = (function () {
      if (!Array.isArray(data.diffgram.NewDataSet)) {
        return [data.diffgram.NewDataSet];
      }
      return data.diffgram.NewDataSet;
    }());

    return packageHistory.map((array) => {
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

  getConnectionSettings() {
    return {
      host: this.host,
      path: this.path,
      wsdl: this.wsdl
    };
  }

  readableTrackingData(trackingData) {
    return `${trackingData.packageId}`;
  }

  callClient(soapClient, trackingData) {
    stream.debug(`calling client with trackingData: ${JSON.stringify(trackingData)}`);
    if (!trackingData) {
      return when.reject(new Error('trackingData should be defined'));
    }
    if (!trackingData.packageId || !nodeValidator.isInt(trackingData.packageId)) {
      return when.reject(new WrongTrackingDataException(`trackingData: ${JSON.stringify(trackingData)} wrong for courier: ${this.courier}`));
    }

    const self = this;
    const packageId = trackingData.packageId;
    return soapClient.createClient(self.getConnectionSettings())
    .call({
      method: 'Tracking_Pieza',
      attributes: {
        xmlns: '#Oca_e_Pak'
      },
      params: {
        Pieza: packageId
      }
    }).then((result) => {
      if (!result) {
        throw new Error('result should be defined');
      }
      return result.data;
    });

  }
}

export default class Courier {
  static buildCourier(courierValue) {
    const actualCourier = Courier.list().find((courierData) => {
      return courierData.value === courierValue;
    });
    if (!actualCourier) {
      throw new CourierNotFoundException(`courierValue ${courierValue} not found`);
    }
    if (actualCourier.value === 'oca') {
      return new Oca();
    }
  }

  static list() {
    return [
      {
        label: 'OCA',
        value: 'oca'
      },
      {
        label: 'BusPack',
        value: 'buspack'
      },
      {
        label: 'Via Cargo',
        value: 'via-cargo'
      }
    ];
  }
}
