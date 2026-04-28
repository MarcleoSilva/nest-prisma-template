import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller.js';
import { ServiceService } from './service/service.service.js';
import { PrismaModule } from '../prisma.module.js';


@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [ServiceService]
})
export class UsersModule {}
