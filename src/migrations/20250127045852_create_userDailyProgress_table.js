exports.up = function (knex) {
    return knex.schema.createTable('userDailyProgress', (table) => {
        table.increments('id').primary();
        table
            .integer('userId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.date('date').notNullable();
        table.integer('calories').notNullable();
        table.integer('caloriesLeft').notNullable();
        table.integer('carbs').notNullable();
        table.integer('carbsLeft').notNullable();
        table.integer('protine').notNullable();
        table.integer('protineLeft').notNullable();
        table.integer('fats').notNullable();
        table.integer('fatsLeft').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('userDailyProgress');
};
