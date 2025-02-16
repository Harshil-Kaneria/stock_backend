module.exports = (sequelize, DataTypes) => {
    const AiMessages = sequelize.define(
        "AiMessages",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            threadId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            chatId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "AiChat", // Make sure this matches the Sequelize model name for `aiChat`
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            messages: {
                type: DataTypes.TEXT("long"),
                allowNull: false,
            },
            sender: {
                type: DataTypes.ENUM("user", "assistant"),
                allowNull: true,
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
            tableName: "aiMessages",
        }
    );

    return AiMessages;
};