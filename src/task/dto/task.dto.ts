import { ParseArrayPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddTaskDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsString()
  desc: string;
  
  @IsString()
  statusId: string;
}
export class UpdateTaskDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsNumber()
  @IsOptional()
  statusId: number;

  @IsNumber()
  @IsOptional()
  position: number;
}
