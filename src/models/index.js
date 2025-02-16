const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();  // Make sure to load environment variables

const basename = path.basename(__filename);
const db = {};

let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        logging: false,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,  // Ensure this is correctly set
    }
);

fs.readdirSync(__dirname)
    .filter(file => (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    ))
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;