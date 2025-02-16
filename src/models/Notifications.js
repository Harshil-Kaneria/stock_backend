module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define(
        "Notifications",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            data: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isAdminNotification: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isDeleted: {
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
            tableName: "notifications",
        }
    );

    return Notifications;
};
