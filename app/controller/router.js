import trackingService from '../services/trackingService';
import {stream} from '../util/logger';
import _ from 'lodash';
import {
  PackageNotFoundException,
  SoapConnectionError,
  CourierNotFoundException,
  WrongTrackingDataException
} from '../util/exceptions';
import Courier from '../data/bookshelf/model/Courier';
import urlMap from './urlMappings';
import EmailManager from '../infrastructure/emailManager';

export default function (app) {

  app.use(function (req, res, next) {
    stream.debug(`Request received for url: ${req.originalUrl}`);
    stream.debug(`POST params: ${JSON.stringify(req.body)}`);
    stream.debug(`GET params: ${JSON.stringify(req.query)}`);
    next();
  });

  app.post(urlMap.subscribe, (req, res) => {
    const emailSubscribe = req.body.email;
    const receiveMoreInfo = req.body.receiveMoreInfo;
    const packageInformation = req.body.packageInformation;

    EmailManager.initialize(req.hostname, app.get('port'));

    trackingService.subscribeEmail(emailSubscribe, receiveMoreInfo, packageInformation)
    .then(() => {
      res.json({
        status: 'ok',
        message: 'Suscripcion satisfactoria'
      });
    })
    .catch((err) => {
      if (err instanceof PackageNotFoundException) {
        res.json({
          status: 'wrong',
          message: 'Paquete no encontrado'
        });
      } else if (err instanceof SoapConnectionError) {
        res.json({
          status: 'wrong',
          message: 'Problemas de conexión con el servidor'
        });
      } else {
        stream.error(err);
        res.status(500).send({ error: 'Unexpected error' });
      }
    });
  });

  app.get(`${urlMap.confirmSubscription}/:encrypted`, (req, res) => {
    let encrypted = req.params.encrypted;
    let CryptoManager = require('../infrastructure/cryptoManager.js');
    let cryptoManager = new CryptoManager();
    const confirmationData = JSON.parse(cryptoManager.decrypt(encrypted));
    const email = confirmationData.email;
    const receiveMoreInfo = confirmationData.receiveMoreInfo ? true : false;
    const packageInformation = confirmationData.packageInformation;
    trackingService.confirmSubscription(email, receiveMoreInfo, packageInformation)
    .then((packageData) => {
      res.render('subscriptionConfirmed', {
        title: 'Suscripción confirmada',
        email: email,
        packageData: packageData
      });
    })
    .catch((err) => {
      stream.error(`error thrown confirming subscription: ${err}`);
      res.render('error', {
        message: 'No se ha podido suscribir a los cambios.'
      });
    });
  });

  app.post(urlMap.tracker, function (req, res) {
    const courierOptions = _.map(Courier.list(), (courierData) => {
      return courierData.value;
    });
    req.checkBody('courier', 'Debe elegir un transporte').notEmpty();
    req.checkBody('courier', 'El transpore elegido no corresponde a las opciones posibles')
      .matches({options: courierOptions});
    req.checkBody('trackingData', 'Debe ingresar la información del paquete').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.json({
        status: 'wrong',
        message: _.map(errors, (err) => {
          return err.msg;
        }).join('. ')
      });
      return;
    }
    let courier = req.body.courier;
    let trackingData = req.body.trackingData;
    trackingService.trackPackage(courier, trackingData)
    .then(
      (data) => {
        stream.debug(JSON.stringify(data));
        res.json({
          status: 'ok',
          data: data
        });
      })
    .catch((err) => {
      if (err instanceof PackageNotFoundException) {
        res.json({
          status: 'wrong',
          message: 'Paquete no encontrado.'
        });
      } else if (err instanceof SoapConnectionError) {
        res.json({
          status: 'wrong',
          message: 'Problemas de conexión con el servidor.'
        });
      } else if (err instanceof WrongTrackingDataException) {
        res.json({
          status: 'wrong',
          message: 'Los datos del paquete no han sido ingresados correctamente.'
        });
      } else if (err instanceof CourierNotFoundException) {
        res.json({
          status: 'wrong',
          message: 'Información del transporte no encontrada.'
        });
      } else {
        stream.error(JSON.stringify(err));
        res.status(500).send({ error: 'Unexpected error' });
      }
    });
  });

  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Seguimiento de encomiendas',
      couriers: Courier.list()
    });
  });

  // 404 Error handling
  app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
}
