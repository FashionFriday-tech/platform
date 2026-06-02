import { CreateFeedbackSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateFeedbackDto extends createZodDto(CreateFeedbackSchema) {}
