import { UpdateProductQualitySchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateQualityDto extends createZodDto(UpdateProductQualitySchema) {}
