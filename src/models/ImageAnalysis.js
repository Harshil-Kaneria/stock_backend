module.exports = (sequelize, DataTypes) => {
    const ImageAnalysis = sequelize.define(
        "ImageAnalysis",
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
            imagePath: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            result: {
                type: DataTypes.TEXT("long"),
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
            tableName: "imageAnalysis",
        }
    );

    return ImageAnalysis;
};
