import trackingService from '../serverServices/trackingService';
import {stream} from '../util/logger';

export default function (app) {

  app.post('/tracker', function (req, res) {
    let courier = req.body.courier;
    let trackingNumber = req.body.trackingNumber;
    trackingService.trackPackage(courier, trackingNumber).then(
      (data) => {
        stream.debug(data.body.json);
        res.json({
          htmlResponse: JSON.stringify(data.body.json)
        });
      })
    .catch((err) => {
      stream.error(err);
      res.status(500);
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
