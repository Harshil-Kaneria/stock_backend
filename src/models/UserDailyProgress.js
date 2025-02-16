module.exports = (sequelize, DataTypes) => {
    const UserDailyProgress = sequelize.define(
        "UserDailyProgress",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users", // Table name of the referenced model
                    key: "id", // Key in the referenced model
                },
                onDelete: "CASCADE",
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            calories: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            caloriesLeft: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            carbs: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            carbsLeft: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            protine: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            protineLeft: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fats: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fatsLeft: {
                type: DataTypes.INTEGER,
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
            tableName: "userDailyProgress",
        }
    );

    return UserDailyProgress;
};
