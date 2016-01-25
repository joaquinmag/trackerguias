import config from './config.json';

export default function () {
  const db = require('../' + config[config.db].init);
  return db;
}
