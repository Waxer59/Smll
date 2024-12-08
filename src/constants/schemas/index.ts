import { z } from 'zod';

export const shortenedLinkSchema = z.object({
  links: z.array(
    z.object({
      url: z.string().url(),
      password: z.string().optional()
    })
  ),
  code: z.string().optional(),
  deleteAt: z.date().optional(),
  activeAt: z.date().optional(),
  maxVisits: z.number().optional(),
  tags: z.array(z.string()).optional()
});

export const editShortenedLinkSchema = z.object({
  links: z
    .array(
      z.object({
        url: z.string().url(),
        password: z.string().optional()
      })
    )
    .optional(),
  code: z.string().optional(),
  deleteAt: z.date().optional(),
  activeAt: z.date().optional(),
  maxVisits: z.number().optional(),
  tags: z.array(z.string()).optional(),
  isEnabled: z.boolean().default(true)
});
