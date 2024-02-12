import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from 'src/tasks/dto/auth-credentials.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(private readonly usersRepository: UsersRepository,
                private jwtService: JwtService
        ) {}
 
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    console.log(this.usersRepository);
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken : string}>{
    const {username, password} = authCredentialsDto

    const query = {username}
    const user = await this.usersRepository.findOne({where: {username: username}})

    if(user && (await bcrypt.compare(password, user.password))){
        const payload: JwtPayload = {username}
        const accessToken: string = await this.jwtService.sign(payload)
        return {accessToken: accessToken}
    }else{
        throw new UnauthorizedException('Please check your login credentials')
    }
      
  }
}
