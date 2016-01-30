import trackingService from '../serverServices/trackingService';
import {stream} from '../util/logger';
import _ from 'lodash';
import {PackageNotFoundException, SoapConnectionError} from '../util/exceptions';

export default function (app) {

  app.use(function (req, res, next) {
    stream.debug(`Request received for url: ${req.originalUrl}`);
    stream.debug(`POST params: ${JSON.stringify(req.body)}`);
    stream.debug(`GET params: ${JSON.stringify(req.query)}`);
    next();
  });

  const errorResponse = function (err, res) {
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
  };

  app.post('/subscribe', (req, res) => {
    const emailSubscribe = req.body.email;
    const receiveMoreInfo = req.body.receiveMoreInfo;
    const trackingData = req.body.trackingData;

    trackingService.subscribeEmail(emailSubscribe, receiveMoreInfo, trackingData)
    .then(() => {
      res.json({
        status: 'ok',
        message: 'Suscripcion satisfactoria'
      });
    })
    .catch((err) => {
      errorResponse(err, res);
    });
  });

  app.post('/tracker', function (req, res) {
    let courier = req.body.courier;
    let trackingNumber = req.body.trackingNumber;
    trackingService.trackPackage(courier, trackingNumber)
    .then(
      (data) => {
        stream.debug(data);
        res.json({
          status: 'ok',
          data: data
        });
      })
    .catch((err) => {
      errorResponse(err, res);
    });
  });

  app.get('/', function (req, res) {
    res.render('index', { title: 'Seguimiento de encomiendas' });
  });

  // 404 Error handling
  app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
}
