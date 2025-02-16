// models/Policies.js
module.exports = (sequelize, DataTypes) => {
    const Policies = sequelize.define('Policies', {
      type: {
        type: DataTypes.ENUM('privacy_policy', 'terms_and_conditions'),
        allowNull: false,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
    }, {
      timestamps: true,
      tableName: 'policies',
    });
  
    return Policies;
  };
  