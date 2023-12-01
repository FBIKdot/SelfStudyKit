import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import fs from 'node:fs';

export default defineConfig(({ command, mode }) => {
    const version = mode === 'production' ? JSON.parse(fs.readFileSync('./package.json', 'utf8'))['version'] : 'v1.x';
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
        define: {
            __APP_VERSION__: JSON.stringify(version),
        },
    };
});
