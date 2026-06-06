import { SyncWishlistDtoSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class SyncWishlistDto extends createZodDto(SyncWishlistDtoSchema) {}
