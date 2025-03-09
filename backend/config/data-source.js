const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "postgres",
    synchronize: false, // Sempre false ao usar migrations
    logging: true,
    // entities: ["src/entities/*.js"],
    migrations: ["migrations/*.js"], // Caminho correto para as migrations
});

module.exports = AppDataSource;
