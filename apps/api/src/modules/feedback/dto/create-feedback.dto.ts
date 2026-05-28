import { createZodDto } from 'nestjs-zod';
import { CreateFeedbackSchema } from '@ff/schemas';

export class CreateFeedbackDto extends createZodDto(CreateFeedbackSchema) {}
