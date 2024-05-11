'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RoomParticipants', {
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rooms',
          key: 'id'
        },
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'participant'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Создаём индекс для улучшения производительности поиска
    await queryInterface.addIndex('RoomParticipants', ['roomId', 'userId'], {
      unique: true,
      name: 'room_user_unique_index'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RoomParticipants');
  }
};
