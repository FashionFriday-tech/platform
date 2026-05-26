import { createZodDto } from 'nestjs-zod';
import { CreateCollectionSchema } from '@ff/schemas';

export class CreateCollectionDto extends createZodDto(CreateCollectionSchema) {}

