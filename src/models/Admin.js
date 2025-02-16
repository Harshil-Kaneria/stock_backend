module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define(
        'Admin',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            secretId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            adminType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            tableName: "admins",
            timestamps: true
        }
    );

    Admin.associate = function (models) {
        // associations can be defined here
    };

    return Admin;
};
