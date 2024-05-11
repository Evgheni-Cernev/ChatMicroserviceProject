import { DataTypes, Model, Sequelize } from "sequelize";

export interface RoomParticipantsAttributes {
  roomId: number;
  userId: number;
  role: string;
}

 interface RoomParticipantsInstance
  extends Model<RoomParticipantsAttributes>,
    RoomParticipantsAttributes {}

export default (sequelize: Sequelize) => {
  const RoomParticipants = sequelize.define<RoomParticipantsInstance>(
    "RoomParticipants",
    {
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Rooms",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "participant",
      },
    },
    {
      tableName: "RoomParticipants",
      timestamps: true,
    }
  );

  return RoomParticipants;
};
