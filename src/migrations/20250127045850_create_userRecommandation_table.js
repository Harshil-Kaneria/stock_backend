exports.up = function (knex) {
    return knex.schema.createTable('userRecommandation', (table) => {
        table.increments('id').primary();
        table
            .integer('userId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.integer('calories').notNullable();
        table.integer('carbs').notNullable();
        table.integer('protine').notNullable();
        table.integer('fats').notNullable();
        table.integer('healthScore').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('userRecommandation');
};
