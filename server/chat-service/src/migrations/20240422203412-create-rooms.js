'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the database if it does not exist
    await queryInterface.sequelize.query(
      'CREATE DATABASE IF NOT EXISTS userdb;'
    );

    // Switch to the new database
    await queryInterface.sequelize.query('USE userdb;');

    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      isDirectMessage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      adminUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      messageExpirationTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rooms');
  },
};
