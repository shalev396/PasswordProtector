import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../../config/providers/sequelize.js';
import {
  type PasswordData,
  type IPasswordRepository,
  PASSWORD_TABLE_NAME,
} from '../definitions/Password.js';

class PasswordModel extends Model {
  declare id: string;
  declare userId: string;
  declare title: string;
  declare username: string | null;
  declare password: string;
  declare website: string | null;
  declare notes: string | null;
  declare category: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

const sequelize = getSequelize();

PasswordModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: PASSWORD_TABLE_NAME,
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  },
);

function toPasswordData(model: PasswordModel): PasswordData {
  return {
    id: model.id,
    userId: model.userId,
    title: model.title,
    username: model.username,
    password: model.password,
    website: model.website,
    notes: model.notes,
    category: model.category,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
}

export const PasswordRepository: IPasswordRepository = {
  async findById(id: string): Promise<PasswordData | null> {
    const record = await PasswordModel.findByPk(id);
    return record ? toPasswordData(record) : null;
  },

  async findAllByUserId(userId: string): Promise<PasswordData[]> {
    const records = await PasswordModel.findAll({ where: { userId } });
    return records.map(toPasswordData);
  },

  async create(data: {
    userId: string;
    title: string;
    username: string | null;
    password: string;
    website: string | null;
    notes: string | null;
    category: string | null;
  }): Promise<PasswordData> {
    const record = await PasswordModel.create({
      userId: data.userId,
      title: data.title,
      username: data.username,
      password: data.password,
      website: data.website,
      notes: data.notes,
      category: data.category,
    });
    return toPasswordData(record);
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      username: string | null;
      password: string;
      website: string | null;
      notes: string | null;
      category: string | null;
    }>,
  ): Promise<PasswordData> {
    const update: Partial<
      Pick<PasswordModel, 'title' | 'username' | 'password' | 'website' | 'notes' | 'category'>
    > = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.username !== undefined) update.username = data.username;
    if (data.password !== undefined) update.password = data.password;
    if (data.website !== undefined) update.website = data.website;
    if (data.notes !== undefined) update.notes = data.notes;
    if (data.category !== undefined) update.category = data.category;

    const [affectedCount] = await PasswordModel.update(update, { where: { id } });
    if (affectedCount === 0) throw new Error('Password not found');

    const record = await PasswordModel.findByPk(id);
    if (record === null) throw new Error('Password not found');
    return toPasswordData(record);
  },

  async deleteById(id: string): Promise<void> {
    await PasswordModel.destroy({ where: { id } });
  },

  async deleteAllByUserId(userId: string): Promise<void> {
    await PasswordModel.destroy({ where: { userId } });
  },
};

export { PasswordModel };
export default PasswordRepository;
