const { Sequelize } = require("sequelize");

const _DATABASE = "heroku_f5a615bb8992807";
const _USER = "bf427319d0845b";
const _PASSWORD = "39b4222c";
const _HOST = "us-cdbr-east-02.cleardb.com";

module.exports = new Sequelize(_DATABASE, _USER, _PASSWORD, {
    host: _HOST,
    dialect: "mysql",
    pool: {
        max: 10,
    },
    port: 3306,
});
