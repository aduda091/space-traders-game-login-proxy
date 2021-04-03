const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
});

sequelize
    .authenticate()
    .then(() => {
        sequelize.sync();
        console.log("Connection has been established successfully.");
    })
    .catch(() => {
        console.log("db error");
    });

module.exports = sequelize;
