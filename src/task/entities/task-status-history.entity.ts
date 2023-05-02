
import { User } from '../../auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.entity';
import { Task } from './task.entity';

@Entity()
export class TaskStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task)
  @JoinColumn()
  task: Task;

  @ManyToOne(() => TaskStatus)
  @JoinColumn()
  fromStatus: TaskStatus;

  @ManyToOne(() => TaskStatus)
  @JoinColumn()
  toStatus: TaskStatus;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
