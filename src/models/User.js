module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
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
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            language: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            countryCode: {
                type: DataTypes.STRING(5),
                allowNull: true,
            },
            phoneNumber: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dob: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            workoutPerWeek: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            otherApp: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isImperial: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            height: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            heightUnit: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            heightSub: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            heightSubUnit: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            weight: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            weightUnit: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            goal: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            goalTarget: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            goalSpeed: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            stoppingGoal: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            diet: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            accomplish: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            profileImage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            fcmToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isProfileCompleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isNotificationOn: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            isFreeTrialEnd: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isSubscribed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            autoSubscription: {
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
            scopes: {
                withSecretColumns: {
                    attributes: { include: ['otp'] },
                },
            },
            tableName: "users",
            timestamps: true,
        }
    );

    User.associate = function (models) {
        // Define associations here
    };

    return User;
};
