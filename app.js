import express from 'express';
import exhbs from 'express-handlebars';
import flash from 'connect-flash';
import path from 'path';
import favicon from 'serve-favicon';
import dexter from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import methodOverride from 'method-override';
import { logger, stream } from './app/util/logger';
import database from './app/config/db';
import { handlebarsHelpers } from './app/util/handlebars';
import merge from 'merge';
import moment from 'moment';

const db = database();
let app = express();

// view engine setup
let hbs = exhbs.create(merge({defaultLayout: 'main'}, handlebarsHelpers));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(favicon(__dirname + '/views/favicon.ico'));

logger.info('Overriding Express logger');
app.use(dexter('combined', {'stream': stream}));
app.set('logger', logger);

moment().utc();
stream.debug(`time set to UTC. Local Time: ${moment().format('dddd Do MMMM YYYY hh:mm:ss a')}`);

app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(flash());
app.use(helmet());

app.use(express.static(path.join(__dirname, '/public/build')));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

require('./app/router/router')(app);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app;
