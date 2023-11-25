import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
    server: {
        port: 5500,
        strictPort: true,
    },
    build: {
        target: 'es2015',
    },
    plugins: [
        createHtmlPlugin({
            minify: true,
            entry: 'src/index.ts',
            template: 'index.html',
        }),
    ],
});
