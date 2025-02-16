/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.boolean("isFreeTrialEnd").defaultTo(0).after('isNotificationOn')
        table.boolean("isSubscribed").defaultTo(0).after('isFreeTrialEnd')
        table.boolean("autoSubscription").defaultTo(0).after('isSubscribed')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.dropColumn("isFreeTrialEnd")
        table.dropColumn("isSubscribed")
        table.dropColumn("autoSubscription")
    })
};
