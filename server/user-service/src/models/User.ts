import { DataTypes, Model, Sequelize } from "sequelize";

export interface UserInstance extends Model {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  age: number | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  region: string | null;
  language: string | null;
  onlineStatus: boolean;
  biography: string | null;
  socialLinks: string[] | null;
  role: string;
  registrationDate: Date;
  lastLoginDate: Date | null;
  notifications: boolean;
}
export default (sequelize: Sequelize) => {
  const User = sequelize.define<UserInstance>(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      publicKey: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        unique: true,
      },
      privateKey: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      region: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      onlineStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      biography: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      socialLinks: {
        type: DataTypes.ARRAY(DataTypes.STRING(255)),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "user",
      },
      registrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
};
