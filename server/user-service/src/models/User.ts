import { DataTypes, Model, Sequelize } from 'sequelize';

interface UserInstance extends Model {
  id: number;
  username: string;
  password: string;
}

export default (sequelize: Sequelize) => {
  const User = sequelize.define<UserInstance>('User', {
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  return User;
};
