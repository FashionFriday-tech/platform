import { UpdateAddressSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateAddressDto extends createZodDto(UpdateAddressSchema) {}
