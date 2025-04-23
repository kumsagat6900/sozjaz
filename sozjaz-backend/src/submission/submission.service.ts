import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSubmissionDto, studentId: string) {
    return this.prisma.submission.create({
      data: {
        content: dto.content,
        assignmentId: dto.assignmentId,
        studentId,
      },
    });
  }

  findMySubmissions(studentId: string) {
    return this.prisma.submission.findMany({
      where: { studentId },
      include: { assignment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByAssignment(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: { student: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, dto: UpdateSubmissionDto) {
    return this.prisma.submission.update({
      where: { id },
      data: {
        grade: dto.grade,
        comment: dto.comment,
      },
    });
  }
  getByStudent(studentId: string) {
    return this.prisma.submission.findMany({
      where: { studentId },
      include: { assignment: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
