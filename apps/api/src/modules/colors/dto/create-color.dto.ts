import { CreateColorSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateColorDto extends createZodDto(CreateColorSchema) {}
