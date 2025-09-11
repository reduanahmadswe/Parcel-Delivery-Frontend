import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import path from 'path'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // some components import motion/react (a small alternative); map it to framer-motion
            'motion/react': 'framer-motion',
        },
    },
    // Provide PostCSS plugins inline so Vite doesn't try to load the project's PostCSS config
    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()],
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
})
