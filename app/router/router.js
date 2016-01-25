export default function (app) {

  app.use('/tracker', function (req, res) {
    res.json({
      htmlResponse: '<p>Hola!</p>'
    });
  });

  app.use('/', function (req, res) {
    res.render('index', { title: 'Seguimiento de encomiendas' });
  });

  // 404 Error handling
  app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
}
