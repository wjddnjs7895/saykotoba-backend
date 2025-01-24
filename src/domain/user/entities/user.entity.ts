import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { SubscriptionEntity } from '../../payment/entities/subscription.entity';
import {
  AuthProvider,
  TIER_MAP,
  UserRole,
} from '@/common/constants/user.constants';
import { ConversationGroupEntity } from '@/domain/conversation/entities/conversation_group.entity';
import { Language } from '@/common/constants/app.constants';
import { ClassroomEntity } from '@/domain/classroom/entities/classroom.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({
    unique: true,
    comment: 'User email address',
  })
  email: string;

  @Column({
    nullable: true,
    select: false,
    comment: 'Password for local authentication',
  })
  password: string;

  @Column({
    nullable: true,
    select: false,
    comment: 'Google OAuth ID',
  })
  googleId: string;

  @Column({
    nullable: true,
    select: false,
    comment: 'Apple OAuth ID',
  })
  appleId: string;

  @Column({
    comment: 'User name',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
    comment: 'Authentication provider type (LOCAL or GOOGLE)',
  })
  provider: AuthProvider;

  @Column({
    default: false,
    comment: 'Whether the user has completed the onboarding process',
  })
  isOnboardingCompleted: boolean;

  @Column({
    default: 0,
    comment: 'User experience points',
  })
  exp: number;

  @Column({
    type: 'json',
    default: [],
    comment: 'List of problem IDs that the user has solved',
  })
  solvedProblemIds: number[];

  @Column({
    type: 'json',
    default: [],
    comment: 'List of conversation IDs that the user has solved',
  })
  solvedConversationIds: number[];

  @Column({
    default: 0,
    comment: 'Number of conversations the user has solved',
  })
  solvedConversationCount: number;

  @Column({
    type: 'enum',
    enum: TIER_MAP,
    default: TIER_MAP.BEGINNER_4,
    comment: 'User tier',
  })
  tier: TIER_MAP;

  @OneToMany(() => ConversationGroupEntity, (group) => group.user)
  conversationGroups: ConversationGroupEntity[];

  @OneToOne(() => SubscriptionEntity, (subscription) => subscription.user)
  subscription: SubscriptionEntity;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.EN,
    comment: 'User language',
  })
  language: Language;

  @Column({
    type: 'json',
    default: [],
    comment: 'User interests',
  })
  interests: string[];

  @OneToMany(() => ClassroomEntity, (classroom) => classroom.user)
  classrooms: ClassroomEntity[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    comment: 'User role',
  })
  role: UserRole;
}
