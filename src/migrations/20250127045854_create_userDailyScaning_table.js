exports.up = function (knex) {
    return knex.schema.createTable('userDailyScaning', (table) => {
        table.increments('id').primary();
        table
            .integer('userDailyProgressId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('userDailyProgress')
            .onDelete('CASCADE');
        table.string('imageUrl').notNullable();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.integer('calories').notNullable();
        table.integer('carbs').notNullable();
        table.integer('protine').notNullable();
        table.integer('fats').notNullable();
        table.integer('healthScore').notNullable();
        table.text('ingredients').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('userDailyScaning');
};
