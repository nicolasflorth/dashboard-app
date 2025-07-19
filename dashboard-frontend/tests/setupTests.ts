import { beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Example setup code
beforeAll(() => {
	console.log('Setting up tests...');
});

afterAll(() => {
	console.log('Cleaning up after tests...');
});

const modules = import.meta.glob('/public/locales/**/*.json', { eager: true }) as Record<string, { default: any }>;

const resources: Record<string, { [namespace: string]: any }> = {};

for (const path in modules) {
	// Example path: /public/locales/de/pages/home.json
	const match = path.match(/\/locales\/([^/]+)\/(.+)\.json$/);
	if (!match) continue;

	const lang = match[1]; // e.g., "de"
	const namespace = match[2].replace(/\//g, '.'); // e.g., "pages.home"

	resources[lang] ??= {};
	const parts = namespace.split('.');

	// Merge deeply: features.transactions.list.json → resources[lang].features.transactions.list
	let current = resources[lang];
	for (let i = 0; i < parts.length - 1; i++) {
		current[parts[i]] ??= {};
		current = current[parts[i]];
	}
	current[parts.at(-1)!] = modules[path].default;
}

(async () => {
	await i18n
		.use(initReactI18next)
		.init({
			lng: 'en', // default test language
			fallbackLng: 'en',
			resources,
			interpolation: { escapeValue: false },
		});
})();