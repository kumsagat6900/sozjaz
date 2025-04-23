import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @Roles('STUDENT')
  create(@Body() dto: CreateSubmissionDto, @CurrentUser() user: any) {
    return this.submissionService.create(dto, user.sub);
  }

  @Get('my')
  @Roles('STUDENT')
  findMySubmissions(@CurrentUser() user: any) {
    return this.submissionService.findMySubmissions(user.sub);
  }

  // 🔥 ВАЖНО: более специфичный маршрут должен идти первым!
  @Get('student/:studentId')
  @Roles('TEACHER')
  getByStudent(@Param('studentId') studentId: string) {
    return this.submissionService.getByStudent(studentId);
  }

  @Get(':assignmentId')
  @Roles('TEACHER')
  findByAssignment(@Param('assignmentId') id: string) {
    return this.submissionService.findByAssignment(id);
  }

  @Patch(':id')
  @Roles('TEACHER')
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }
}
