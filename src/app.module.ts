import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

import config from '../ormconfig'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Post } from './entities/post.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forRoot(config), AuthModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
