/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("adminNotifications", (table) => {
        table.increments("id").primary().index();
        table.string("title").notNullable();
        table.text("body").notNullable();
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("adminNotifications");
};