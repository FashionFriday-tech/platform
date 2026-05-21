import { createZodDto } from 'nestjs-zod';
import { UpdateCategorySchema } from '@ff/schemas';

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
