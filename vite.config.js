import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ command, mode }) => {
    return {
        server: {
            port: 5500,
            strictPort: true,
        },
        build: {
            target: 'es2015',
        },
        esbuild: {
            drop: mode === 'production' ? ['console', 'debugger'] : [],
        },
        plugins: [
            createHtmlPlugin({
                minify: true,
                entry: 'src/index.ts',
                template: 'index.html',
            }),
        ],
    };
});
