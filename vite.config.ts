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
            '@/app': path.resolve(__dirname, './src/app'),
            '@/shared': path.resolve(__dirname, './src/shared'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/features': path.resolve(__dirname, './src/features'),
            '@/pages': path.resolve(__dirname, './src/pages'),
            
            // Legacy paths for backwards compatibility
            '@/constants': path.resolve(__dirname, './src/shared/constants'),
            '@/types': path.resolve(__dirname, './src/shared/types'),
            '@/utils': path.resolve(__dirname, './src/shared/utils'),
            '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
            '@/services': path.resolve(__dirname, './src/shared/services'),
            '@/store': path.resolve(__dirname, './src/app/store'),
            '@/contexts': path.resolve(__dirname, './src/app/contexts'),
            
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
