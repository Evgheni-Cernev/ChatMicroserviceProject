import { Sequelize } from "sequelize";
import setupUserModel from "./User";

const sequelize = new Sequelize(process.env.DATABASE_URL ?? "postgres://postgres:password@localhost:5432/userdb", {
  dialect: "postgres",
  logging: false,
});

const User = setupUserModel(sequelize);

export { User };
export default sequelize;
