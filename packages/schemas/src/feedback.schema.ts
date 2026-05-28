import { z } from 'zod';

export const FeedbackSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['issue', 'improvement', 'suggestion', 'other']),
  description: z.string().min(5, 'Description must be at least 5 characters long').max(500, 'Description cannot exceed 500 characters'),
  email: z.string().email('Invalid email address').max(150, 'Email address cannot exceed 150 characters').or(z.literal('')).nullable().optional(),
  createdAt: z.union([z.string(), z.date()]),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

export const CreateFeedbackSchema = FeedbackSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;

