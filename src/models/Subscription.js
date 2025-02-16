module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define(
        "Subscription",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            receiptType: {
                type: DataTypes.ENUM("android", "ios", "web"),
                allowNull: true,
            },
            subscriptionId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            subscriptionAmount: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            invoiceId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            transactionDate: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dataAndroid: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            productId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            purchaseToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            transactionId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            originalTransactionIdentifierIOS: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            originalTransactionDateIOS: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            transactionReceipt: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            purchaseStateAndroid: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            signatureAndroid: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            isAcknowledgedAndroid: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            autoRenewingAndroid: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isRestore: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: true,
            tableName: "subscription",
        }
    );

    return Subscription;
};
