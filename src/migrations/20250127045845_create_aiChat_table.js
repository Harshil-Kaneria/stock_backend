exports.up = function (knex) {
    return knex.schema.createTable('aiChat', (table) => {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('threadId').notNullable();
        table.enu('status', ['active', 'archived', 'deleted', 'completed']).defaultTo('active')
        table.specificType('memory', 'longblob');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('aiChat');
};
