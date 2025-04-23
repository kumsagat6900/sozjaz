import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateSubmissionDto {
  @IsInt()
  @Min(0)
  @Max(100)
  grade: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
