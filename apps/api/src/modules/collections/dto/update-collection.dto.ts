import { UpdateCollectionSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateCollectionDto extends createZodDto(UpdateCollectionSchema) {}
