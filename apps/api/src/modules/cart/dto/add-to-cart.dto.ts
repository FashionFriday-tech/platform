import { AddToCartSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class AddToCartDto extends createZodDto(AddToCartSchema) {}
