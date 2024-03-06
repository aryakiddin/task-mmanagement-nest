import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { configValidationSchema } from './tasks/config.schema';

@Module({
  imports: [TasksModule, ConfigModule.forRoot({
    envFilePath: [`.env.stage.${process.env.STAGE}`],
    validationSchema: configValidationSchema
  }),

  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        host:configService.get('DB_HOST'),
        port:configService.get('DB_PORT'),
        username:configService.get('DB_USERNAME'),
        password:configService.get('DB_PASSWORD'),
      }
    }
  })]
    
  //   TypeOrmModule.forRoot({
  //   type: 'postgres',
  //   // host: 'localhost',
  //   // port: 5432,
  //   // username: 'postgres',
  //   // password: 'postgres',
  //   // database: 'task-management',
  //   autoLoadEntities: true,
  //   synchronize: true,
  //   logging:true,
  //   entities: [Task]
  // }), AuthModule],

})
export class AppModule {}


