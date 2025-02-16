exports.up = function (knex) {
    return knex.schema.createTable('imageAnalysis', (table) => {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('imagePath').notNullable();
        table.text('result', 'longtext').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('imageAnalysis');
};
