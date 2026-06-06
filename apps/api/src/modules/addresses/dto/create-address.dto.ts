import { CreateAddressSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateAddressDto extends createZodDto(CreateAddressSchema) {}
