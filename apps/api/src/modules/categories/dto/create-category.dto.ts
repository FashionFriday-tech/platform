import { createZodDto } from 'nestjs-zod';
import { CreateCategorySchema } from '@ff/schemas';

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
