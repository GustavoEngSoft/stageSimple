const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateTables1700000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                birthdate TIMESTAMP NOT NULL,
                ssn VARCHAR(11) UNIQUE,
                photo TEXT,
                loginAttempts INT DEFAULT 0,
                isActive BOOLEAN DEFAULT TRUE
            );

            CREATE TABLE projects (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                startDate DATE DEFAULT NULL,
                userEmail VARCHAR(255) NOT NULL,
                status JSON DEFAULT NULL,
                progress DECIMAL(5,2) DEFAULT NULL
            );

            CREATE TABLE folders (
                id SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
            );

            CREATE TABLE members (
                id SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                member VARCHAR(255) NOT NULL,
                FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
            );

            CREATE TABLE payroll (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                hoursWorked DECIMAL(10,2) NOT NULL,
                hourlyRate DECIMAL(10,2) NOT NULL
            );

            CREATE TABLE project_history (
                id SERIAL PRIMARY KEY,
                project_id INT NOT NULL,
                user_id INT NOT NULL,
                action VARCHAR(255) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            );

            CREATE TABLE projectdetails (
                id SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                startDate DATE DEFAULT NULL,
                userEmail VARCHAR(255) DEFAULT NULL,
                FOREIGN KEY (projectId) REFERENCES projects (id)
            );

            CREATE TABLE projectfiles (
                id SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                data BYTEA NOT NULL,
                folderId INT DEFAULT NULL,
                mimetype VARCHAR(255) NOT NULL,
                FOREIGN KEY (projectId) REFERENCES projects (id),
                FOREIGN KEY (folderId) REFERENCES folders (id)
            );

            CREATE TABLE projectmaterials (
                id SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                value DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (projectId) REFERENCES projects (id)
            );
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE IF EXISTS projectmaterials;
            DROP TABLE IF EXISTS projectfiles;
            DROP TABLE IF EXISTS projectdetails;
            DROP TABLE IF EXISTS project_history;
            DROP TABLE IF EXISTS payroll;
            DROP TABLE IF EXISTS members;
            DROP TABLE IF EXISTS folders;
            DROP TABLE IF EXISTS projects;
            DROP TABLE IF EXISTS users;
        `);
    }
};
