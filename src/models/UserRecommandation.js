module.exports = (sequelize, DataTypes) => {
    const UserRecommandation = sequelize.define(
        "UserRecommandation",
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
            tableName: "userRecommandation",
        }
    );

    return UserRecommandation;
};
