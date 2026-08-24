import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
	loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		label: z.string().optional(),
		navGroup: z.enum(['Start here', 'Build and publish', 'Manage', 'Help']),
		groupOrder: z.number().int(),
		navOrder: z.number().int(),
	}),
});

export const collections = { docs };
