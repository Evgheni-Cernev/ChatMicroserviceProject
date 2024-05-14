'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      region: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      language: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      onlineStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      biography: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      socialLinks: {
        type: Sequelize.ARRAY(Sequelize.STRING(255)),
        allowNull: true
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'user'
      },
      registrationDate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      lastLoginDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      notifications: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      publicKey: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        unique: true,
      },
      privateKey: {
        type: Sequelize.STRING(2048),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
