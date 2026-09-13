import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
export const topics = ['grammar', 'vocabulary', 'phrases', 'mistakes'] as const;
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
      const date = new Date(value);
      return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
    }, 'Use a valid YYYY-MM-DD date in quotes'),
    day: z.number().int().positive(),
    summary: z.string().min(1),
    topics: z.array(z.enum(topics)).min(1),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  }),
});
export const collections = { lessons };
