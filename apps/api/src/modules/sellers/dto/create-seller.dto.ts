import { CreateSellerSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateSellerDto extends createZodDto(CreateSellerSchema) {}
