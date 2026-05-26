import { createZodDto } from 'nestjs-zod';
import { UpdateCollectionSchema } from '@ff/schemas';

export class UpdateCollectionDto extends createZodDto(UpdateCollectionSchema) {}

