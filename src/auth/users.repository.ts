import { DataSource, EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "src/tasks/dto/auth-credentials.dto";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassord = await bcrypt.hash(password, salt)
        const user: any = this.create({ username, password: hashedPassord });
        try {
            await this.save(user);
        } catch (err) {
            console.log(err)
            if (err.code === '23505') {
                throw new ConflictException('Username already exists!')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}