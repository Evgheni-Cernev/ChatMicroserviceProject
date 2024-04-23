import { DataTypes, Model, Sequelize } from 'sequelize';

export interface MessageAttributes {
  id?: number;
  roomId: number;
  senderId: number;
  content: string;
  timestamp: Date;
}

interface MessageInstance extends Model<MessageAttributes, MessageAttributes> {
  id: number;
  roomId: number;
  senderId: number;
  content: string;
  timestamp: Date;
}

export default (sequelize: Sequelize) => {
  const Message = sequelize.define<MessageInstance>(
    'Message', 
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Rooms',
          key: 'id'
        }
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, 
    {
      tableName: 'Messages',
      timestamps: false 
    }
  );

  return Message;
};
