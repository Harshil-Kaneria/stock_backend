/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("notifications", (table) => {
        table.increments("id").primary().index();
        table.integer("userId").notNullable().index();
        table.string("title").notNullable();
        table.text("body").notNullable();
        table.json("data").nullable();
        table.string("type").notNullable();
        table.boolean("isAdminNotification").defaultTo(false);
        table.boolean("isDeleted").defaultTo(false);
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("notifications");
};