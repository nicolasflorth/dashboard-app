import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		silent: false,           // Show logs
    	reporters: 'verbose',    // Optional, adds detail
		globals: true,
		environment: 'jsdom',
		setupFiles: './tests/setupTests.ts',
		coverage: {
			reporter: ['text', 'html'],
		},
	},
});
