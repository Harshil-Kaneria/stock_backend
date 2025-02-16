exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();
    return knex.schema.createTable("users", function (table) {
        table.increments("id").primary().index();
        table.string("secretId").notNullable().index();
        table.string("name").nullable();
        table.string("email").nullable();
        table.string("language").nullable();
        table.string("country").nullable();
        table.string("gender").nullable();
        table.string("countryCode", 5).nullable();
        table.string("phoneNumber", 15).nullable()
        table.string("otp").nullable();
        table.string("dob").nullable();
        table.string("workoutPerWeek").nullable();
        table.boolean("otherApp").defaultTo(false)
        table.boolean("isImperial").defaultTo(true)
        table.string("height").nullable();
        table.string("heightUnit").nullable();
        table.string("heightSub").nullable();
        table.string("heightSubUnit").nullable();
        table.string("weight").nullable();
        table.string("weightUnit").nullable();
        table.string("goal").nullable();
        table.string("goalTarget").nullable();
        table.string("goalSpeed").nullable();
        table.string("stoppingGoal").nullable();
        table.string("diet").nullable();
        table.string("accomplish").nullable();
        table.string("profileImage").nullable();
        table.string('fcmToken').nullable()
        table.boolean("isProfileCompleted").defaultTo(false)
        table.boolean("isNotificationOn").defaultTo(true)
        table.boolean("isDeleted").defaultTo(false)
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};