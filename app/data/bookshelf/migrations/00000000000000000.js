/**
 * Naming convention for migration files is date, hours, minutes, seconds, milliseconds
 * 4+2+2+2+2+2+3 = 17 numbers e.g. 20150331211015325
 **/

export function up(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('trackings', function (table) {
      table.increments('id').primary().unsigned();
      table.string('courier', 255).notNullable();
      table.string('email', 255).notNullable();
      table.boolean('marketing').notNullable();
      table.string('trackingData', 255).notNullable();
      table.dateTime('created').notNullable();
      table.dateTime('updated').notNullable();
      table.boolean('expired').notNullable();
      table.unique(['courier', 'trackingData', 'email']);
    }),
    knex.schema.createTable('updates', function (table) {
      table.increments('id').primary().unsigned();
      table.datetime('fecha').notNullable();
      table.string('estado', 255).notNullable();
      table.string('sucursal', 255).notNullable();
      table.string('motivo').notNullable();
      table.integer('trackingId').notNullable().unsigned().index().references('id').inTable('trackings');
      table.datetime('created').notNullable();
    })
  ]);
}

export function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('updates'),
    knex.schema.dropTable('trackings')
  ]);
}
