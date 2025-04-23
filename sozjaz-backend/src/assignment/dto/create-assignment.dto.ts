import { AssignmentType } from '@prisma/client';
import { IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  example?: string;
}
