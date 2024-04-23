import { Sequelize } from "sequelize";
import setupRoomModel, { RoomAttributes } from "./Room";
import setupMessageModel, { MessageAttributes } from "./Message";

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

export { Room, Message, RoomAttributes, MessageAttributes };
export default sequelize;
