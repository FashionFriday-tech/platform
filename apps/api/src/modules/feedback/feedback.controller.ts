import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@ff/database';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @Post()
  async createFeedback(
    @Body('type') type: string,
    @Body('description') description: string,
    @Body('email') email?: string,
  ) {
    return this.service.createFeedback(type, description, email);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF_ADMIN)
  async getAllFeedback() {
    return this.service.getAllFeedback();
  }
}
