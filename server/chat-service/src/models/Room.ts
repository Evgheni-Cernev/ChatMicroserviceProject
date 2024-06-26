import { DataTypes, Model, Sequelize } from "sequelize";
import { RoomParticipantsAttributes } from "./";

export interface RoomAttributes {
  id?: number;
  isDirectMessage: boolean;
  chatName: string;
  adminUserId?: number;
  messageExpirationTime?: number;
  participants?: RoomParticipantsAttributes[];
}

interface RoomInstance
  extends Model<RoomAttributes, RoomAttributes>,
    RoomAttributes {}

export default (sequelize: Sequelize) => {
  const Room = sequelize.define<RoomInstance>(
    "Room",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chatName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDirectMessage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      adminUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      messageExpirationTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 15,
      },
    },
    {
      tableName: "Rooms",
      timestamps: true,
    }
  );

  return Room;
};
