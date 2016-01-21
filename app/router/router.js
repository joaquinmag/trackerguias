
export default function (app, passport) {

  app.use('/', function (req, res) {
    res.render('index', { title: "Seguimiento de encomiendas" });
  });

  // 404 Error handling
  app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
}
