import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { bcrypt } from 'bcrypt'
import { User } from '../entities/user.entity';
import { UserModel } from './user.model';
import { throwError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
  async signup(username: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { username } })
    if (user) {
      return { msg: "Username Already Taken" }
    }

    return this.usersRepository.save({})
  }

}
