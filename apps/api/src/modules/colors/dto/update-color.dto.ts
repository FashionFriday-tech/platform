import { UpdateColorSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateColorDto extends createZodDto(UpdateColorSchema) {}
