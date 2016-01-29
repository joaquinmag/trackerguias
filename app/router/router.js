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

  app.post('/tracker', function (req, res) {
    let courier = req.body.courier;
    let trackingNumber = req.body.trackingNumber;
    trackingService.trackPackage(courier, trackingNumber)
    .then(
      (data) => {
        stream.debug(data);
        res.json({
          state: 'ok',
          data: data
        });
      })
    .catch((err) => {
      if (err instanceof PackageNotFoundException) {
        res.json({
          state: 'wrong',
          message: 'Paquete no encontrado'
        });
      } else if (err instanceof SoapConnectionError) {
        res.json({
          state: 'wrong',
          message: 'Problemas de conexión con el servidor'
        });
      } else {
        stream.error(err);
        res.status(500).send({ error: 'Unexpected error' });
      }
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
