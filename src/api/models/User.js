const sequelize = require("../../config/dbConnection");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
    "User",
    {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        profilePhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        table: "users",
    }
);

module.exports = User;
