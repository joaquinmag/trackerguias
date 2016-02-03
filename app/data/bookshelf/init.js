import knex from 'knex';
import config from '../../config/config.json';
import Bookshelf from 'bookshelf';

const dbConf = config.bookshelf[config.bookshelf.db];
const knexConfig = knex(dbConf);
let bookshelf = new Bookshelf(knexConfig);

bookshelf.models = {};

// Register models
import Tracking from './model/Tracking';
Tracking.register(bookshelf);
import Update from './model/Update';
Update.register(bookshelf);

// TODO: Migrations functions to automatically update DB
// var db = import from'./db/schema').tables;

export default bookshelf;
