import { UpdateCategorySchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
