exports.up = function (knex) {
    return knex.schema.createTable('policies', (table) => {
        table.increments('id').primary();
        table.enu('type', ['privacy_policy', 'terms_and_conditions']).notNullable().unique();
        table.text('content', 'longtext').notNullable(); // Allows unlimited text
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('policies');
};
