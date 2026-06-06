import { UpdateCartQuantitySchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateCartQuantityDto extends createZodDto(UpdateCartQuantitySchema) {}
