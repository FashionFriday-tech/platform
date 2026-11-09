import { CreateProductQualitySchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateQualityDto extends createZodDto(CreateProductQualitySchema) {}
