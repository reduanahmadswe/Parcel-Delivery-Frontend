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
            '@/components': path.resolve(__dirname, './src/components'),
            '@/features': path.resolve(__dirname, './src/features'),
            '@/pages': path.resolve(__dirname, './src/pages'),
            '@/constants': path.resolve(__dirname, './src/constants'),
            '@/types': path.resolve(__dirname, './src/types'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/services': path.resolve(__dirname, './src/services'),
            '@/store': path.resolve(__dirname, './src/store'),
            '@/contexts': path.resolve(__dirname, './src/contexts'),
            
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
