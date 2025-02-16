module.exports = (sequelize, DataTypes) => {
    const AiChat = sequelize.define(
        "AiChat",
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
                    model: 'Users', // references the Users table
                    key: 'id',
                },
                onDelete: 'CASCADE', // to delete related records when the user is deleted
            },
            threadId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('active', 'archived', 'deleted', 'completed'),
                defaultValue: 'active'
            },
            memory: {
                type: DataTypes.BLOB('long'),
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
            tableName: "aiChat",
        }
    );

    AiChat.associate = (models) => {
        // Define associations if necessary
        AiChat.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return AiChat;
};