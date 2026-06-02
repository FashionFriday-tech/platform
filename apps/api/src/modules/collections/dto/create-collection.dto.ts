import { CreateCollectionSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateCollectionDto extends createZodDto(CreateCollectionSchema) {}
