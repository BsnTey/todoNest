import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { OptionalUser } from '../common/types/user.interface';
import { SEQUELIZE } from '../database';
import { User, UserCreationAttrs } from '../entity/user.entity';
import { BasePaginationDto } from '../task/dto';

@Injectable()
export class UserRepository {
  private readonly userModel: typeof User;

  constructor(@Inject(SEQUELIZE) private sequelizeInstance: Sequelize) {
    this.userModel = this.sequelizeInstance.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async create(createUser: UserCreationAttrs): Promise<User> {
    const { email, password, name, birthday, role } = createUser;
    return this.userModel.create({ email, password, name, birthday, role });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findByPk(userId);
  }

  async update(userId: string, user: OptionalUser): Promise<[number, User[]]> {
    return this.userModel.update(
      {
        ...user,
      },
      {
        where: { id: userId },
        returning: true,
      },
    );
  }

  async getAll(
    query: BasePaginationDto,
  ): Promise<{ count: number; rows: User[] }> {
    const { limit = 100, offset = 0, ...rest } = query;

    const options = {
      limit,
      offset,
      ...rest,
    };

    return this.userModel.findAndCountAll(options);
  }
}
