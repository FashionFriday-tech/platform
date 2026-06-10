import { UpdateSellerSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateSellerDto extends createZodDto(UpdateSellerSchema) {}
