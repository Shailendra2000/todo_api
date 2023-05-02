import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
  } from '@nestjs/common';
  import { HttpStatusCode } from 'axios';
  import * as bcrypt from 'bcrypt';
  import { UserRepository } from '../repositories';
  
  @Injectable()
  export class SignInGuard implements CanActivate {
    constructor(private userRepository: UserRepository) {}
    public async canActivate(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();
      const { email, password } = req.body;
      try {
        const userPassword = await this.userRepository.getPassword(email);
        if (await bcrypt.compare(password, userPassword)) {
          return true;
        }
        throw new HttpException('Wrong password', HttpStatusCode.Unauthorized);
      } catch (e) {
        throw new HttpException(
          'Enter Credentials Carefully',
          HttpStatusCode.BadRequest,
        );
      }
    }
  }