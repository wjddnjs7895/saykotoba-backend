import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomController } from './classroom.controller';
import { ClassroomEntity } from './entities/classroom.entity';
import { ClassroomService } from './classroom.service';
import { UserModule } from '../user/user.module';
import { ConversationGroupEntity } from '../conversation/entities/conversation_group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassroomEntity, ConversationGroupEntity]),
    UserModule,
  ],
  controllers: [ClassroomController],
  exports: [ClassroomService],
  providers: [ClassroomService],
})
export class ClassroomModule {}
