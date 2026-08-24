import type { CollectionEntry } from 'astro:content';

export type DocEntry = CollectionEntry<'docs'>;

export const docPath = (entry: DocEntry) => entry.id === 'overview' ? '/' : `/${entry.id}/`;

export const sortDocs = (entries: DocEntry[]) => entries.sort((a, b) => {
	return a.data.groupOrder - b.data.groupOrder || a.data.navOrder - b.data.navOrder;
});

export const groupDocs = (entries: DocEntry[]) => {
	const groups = new Map<string, DocEntry[]>();
	for (const entry of sortDocs(entries)) {
		const group = groups.get(entry.data.navGroup) ?? [];
		group.push(entry);
		groups.set(entry.data.navGroup, group);
	}
	return [...groups.entries()];
};
