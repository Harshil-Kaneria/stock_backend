/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("subscription", function (table) {
        table.increments("id").primary();
        table.string("userId").nullable()
        table.enum('receiptType', ['android', 'ios', 'web']).nullable()
        table.string("subscriptionId").nullable()
        table.string("subscriptionAmount").nullable()
        table.string("invoiceId").nullable()
        table.date("startDate").nullable()
        table.date("endDate").nullable()
        table.string("transactionDate").nullable()
        table.text("dataAndroid").nullable()
        table.string("productId").nullable()
        table.string("purchaseToken").nullable()
        table.string("transactionId").nullable()
        table.string("originalTransactionIdentifierIOS").nullable()
        table.string("originalTransactionDateIOS").nullable()
        table.text("transactionReceipt").nullable()
        table.string("purchaseStateAndroid").nullable()
        table.text("signatureAndroid").nullable()
        table.boolean("isAcknowledgedAndroid").defaultTo(0)
        table.boolean("autoRenewingAndroid").defaultTo(0)
        table.boolean("isRestore").defaultTo(0)
        table.timestamp("updatedAt").defaultTo(knex.fn.now())
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("subscription");
};
