import { createZodDto } from 'nestjs-zod';
import { CreateProductSchema } from '@ff/schemas';

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
