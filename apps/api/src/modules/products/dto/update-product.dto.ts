import { createZodDto } from 'nestjs-zod';
import { UpdateProductSchema } from '@ff/schemas';

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
