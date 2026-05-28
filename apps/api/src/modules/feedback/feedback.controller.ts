import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @Post()
  async createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.service.createFeedback(dto.type, dto.description, dto.email ?? undefined);
  }

  @Get('admin')
  async getAllFeedback(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.service.getAllFeedback(parsedLimit, parsedOffset);
  }
}
