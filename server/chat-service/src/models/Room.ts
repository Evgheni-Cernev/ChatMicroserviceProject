import { DataTypes, Model, Sequelize } from 'sequelize';

export interface RoomAttributes {
  id?: number;
  user1Id: number;
  user2Id: number;
}

interface RoomInstance extends Model<RoomAttributes, RoomAttributes> {
  id: number;
  user1Id: number;
  user2Id: number;
}

export default (sequelize: Sequelize) => {
  const Room = sequelize.define<RoomInstance>(
    'Room', 
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, 
    {
      tableName: 'Rooms',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['user1Id', 'user2Id']
        }
      ]
    }
  );

  return Room;
};
