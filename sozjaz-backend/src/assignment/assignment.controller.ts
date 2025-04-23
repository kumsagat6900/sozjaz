import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common'; // Added Get here
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Post()
  @Roles('TEACHER') // ⬅️ только учитель может!
  create(@Body() dto: CreateAssignmentDto, @CurrentUser() user: any) {
    return this.assignmentService.create(dto, user.sub);
  }

  @Get() // This should now work
  @Roles('STUDENT', 'TEACHER')
  @UseGuards(JwtAuthGuard, RolesGuard) // Note: This is redundant since it's already at the class level
  findAll() {
    return this.assignmentService.findAll();
  }
}
