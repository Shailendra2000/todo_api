import { User } from '../../auth/entities';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class UserTaskMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Task)
  @JoinColumn()
  task: Task;
}
