import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entity/user.entity';
import { CreateUserDto } from './dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, birthday } = createUserDto;
    return this.userModel.create({ email, password, name, birthday });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }
}
