const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: "postgres",
    logging: false, // Set to true for debugging queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL");
    } catch (error) {
        console.error("Unable to connect to PostgreSQL:", error);
    }
};

module.exports = { sequelize, connectDB };
