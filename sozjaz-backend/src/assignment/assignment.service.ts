import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentType } from '@prisma/client';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAssignmentDto, userId: string) {
    return this.prisma.assignment.create({
      data: {
        title: dto.title,
        type: dto.type,
        content: dto.content,
        example: dto.example, // ✅ Добавили
        createdById: userId,
      },
    });
  }

  findAll() {
    return this.prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
