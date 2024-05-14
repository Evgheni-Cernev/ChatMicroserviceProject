import { DataTypes, Model, Sequelize } from "sequelize";

export interface MessageAttributes {
  id?: number;
  roomId: number;
  senderId: number;
  content?: string;
  timestamp: Date;
  filePath?: string;
  fileExtension?: string;
}

export interface MessageInstance
  extends Model<MessageAttributes, MessageAttributes>,
    MessageAttributes {}

export default (sequelize: Sequelize) => {
  const Message = sequelize.define<MessageInstance>(
    "Message",
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
          model: "Rooms",
          key: "id",
        },
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(2048),
        allowNull: true,
      },
      filePath: {
        type: DataTypes.STRING,
      },
      fileExtension: {
        type: DataTypes.STRING,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Messages",
      timestamps: false,
    }
  );

  return Message;
};
