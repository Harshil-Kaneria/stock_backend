exports.up = function (knex) {
    return knex.schema.createTable('aiMessages', (table) => {
        table.increments('id').primary();
        table.string('threadId').notNullable();
        table.integer('chatId').unsigned().notNullable().references('id').inTable('aiChat').onDelete('CASCADE');
        table.text('messages', 'longtext').notNullable();
        table.enu('sender', ['user', 'assistant']).nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('aiMessages');
};
