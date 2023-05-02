import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar',{length:100,nullable:false})
  name: string;
  
  @Column('varchar',{length:100, unique:true,nullable:false})
  email:string;

  @Column('varchar',{length:100, nullable:false})
  password:string;

  @Column('varchar',{length:400, nullable:false})
  accessToken:string

  @Column('boolean')
  isActive:boolean;

}