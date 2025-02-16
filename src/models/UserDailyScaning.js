module.exports = (sequelize, DataTypes) => {
    const UserDailyScaning = sequelize.define(
        "UserDailyScaning",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userDailyProgressId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "UserDailyProgress", // Table name of the referenced model
                    key: "id", // Key in the referenced model
                },
                onDelete: "CASCADE",
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            calories: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            carbs: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            protine: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fats: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            healthScore: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ingredients: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: true,
            tableName: "userDailyScaning",
        }
    );

    return UserDailyScaning;
};
