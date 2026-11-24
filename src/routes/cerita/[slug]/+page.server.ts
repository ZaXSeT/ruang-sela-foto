import { error } from '@sveltejs/kit';
import { db } from '#lib/server/db.ts';
import { listPackages } from '#lib/server/inquiries.ts';
import { STORIES, storyBySlug } from '#lib/stories.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const story = storyBySlug(params.slug);
	if (!story) error(404, 'Cerita tidak ditemukan');
	const pkg = (await listPackages(db())).find((p) => p.id === story.packageId) ?? null;
	const i = STORIES.indexOf(story);
	const next = STORIES[(i + 1) % STORIES.length];
	return { slug: story.slug, pkg, next: { slug: next.slug, title: next.title } };
};
