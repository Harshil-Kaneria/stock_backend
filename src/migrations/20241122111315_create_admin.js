exports.up = function (knex) {
    return knex.schema.createTable("admins", function (table) {
        table.increments("id").primary().index();
        table.string("secretId").notNullable().index();
        table.string("name").notNullable();
        table.string("email").index().notNullable();
        table.string("password").notNullable();
        table.string("adminType").notNullable();
        table.boolean("isDeleted").defaultTo(false).index();
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
        table.timestamp("createdAt").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("admins");
};