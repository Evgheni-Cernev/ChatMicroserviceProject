import { Sequelize } from "sequelize";
import setupRoomModel, { RoomAttributes } from "./Room";
import setupMessageModel, { MessageAttributes } from "./Message";
import setupRoomParticipantsModel, {
  RoomParticipantsAttributes,
} from "./RoomParticipants";

const sequelize = new Sequelize(
  process.env.DATABASE_URL ??
    "postgres://postgres:password@localhost:5432/chatdb",
  {
    dialect: "postgres",
    logging: false,
  }
);

const Room = setupRoomModel(sequelize);
const Message = setupMessageModel(sequelize);
const RoomParticipants = setupRoomParticipantsModel(sequelize);

Room.hasMany(Message, { foreignKey: "roomId" });
Message.belongsTo(Room, { foreignKey: "roomId" });

Room.hasMany(RoomParticipants, {
  foreignKey: "roomId",
  as: "participants",
});
RoomParticipants.belongsTo(Room, { foreignKey: "roomId" });

export {
  Room,
  Message,
  RoomParticipants,
  RoomAttributes,
  MessageAttributes,
  RoomParticipantsAttributes,
};
export default sequelize;
