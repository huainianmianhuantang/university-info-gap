import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { RESOURCE_CATEGORIES } from './config';

const resourceCategoryIds = RESOURCE_CATEGORIES.map((c) => c.id) as [
  string,
  ...string[],
];

const item = z.object({
  title: z.string(),
  content: z.string(),
});

const universities = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/universities',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    province: z.string(),
    city: z.string(),
    type: z.enum(['综合', '理工', '师范', '农林', '医药', '财经', '政法', '语言', '艺术', '体育', '其他']),
    levels: z.array(z.enum(['985', '211', '双一流', '普通'])).min(1),
    tags: z.array(z.string()).default([]),
    established: z.number().optional(),
    campuses: z.array(z.string()).default([]),
    brief: z.string(),
    featured: z.boolean().default(false),
    cover: z.string().default('/images/cover-default.svg'),

    transferPolicy: z
      .object({
        summary: z.string().default(''),
        points: z.array(item).default([]),
        sources: z.array(z.string()).default([]),
      })
      .optional(),

    secondarySelection: z
      .object({
        summary: z.string().default(''),
        programs: z
          .array(z.object({ name: z.string(), content: z.string() }))
          .default([]),
        sources: z.array(z.string()).default([]),
      })
      .optional(),

    trainingPlan: z
      .object({
        summary: z.string().default(''),
        points: z.array(item).default([]),
        sources: z.array(z.string()).default([]),
      })
      .optional(),

    dorm: z
      .object({
        summary: z.string().default(''),
        items: z
          .array(z.object({ name: z.string(), content: z.string() }))
          .default([]),
        sources: z.array(z.string()).default([]),
      })
      .optional(),

    classes: z
      .object({
        summary: z.string().default(''),
        points: z.array(item).default([]),
        sources: z.array(z.string()).default([]),
      })
      .optional(),

    clubs: z
      .object({
        summary: z.string().default(''),
        items: z
          .array(z.object({ name: z.string(), content: z.string() }))
          .default([]),
        sources: z.array(z.string()).default([]),
      })
      .optional(),

    materials: z
      .array(
        z.object({
          category: z.enum(resourceCategoryIds),
          audience: z.enum(['parent', 'student', 'both']).default('both'),
          title: z.string(),
          description: z.string().default(''),
          type: z.enum(['pdf', 'doc', 'ppt', 'xlsx', '其他']).default('其他'),
          link: z.string(),
          code: z.string().optional(),
        }),
      )
      .default([]),

    videos: z
      .array(
        z.object({
          audience: z.enum(['parent', 'student', 'both']).default('both'),
          title: z.string(),
          platform: z.enum(['bilibili', 'youku', 'tencent', '其他']).default('bilibili'),
          id: z.string().default(''),
          url: z.string().optional(),
          source: z.string().default(''),
          description: z.string().default(''),
          tags: z.array(z.string()).default([]),
        }),
      )
      .default([]),
  }),
});

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { universities, articles };
