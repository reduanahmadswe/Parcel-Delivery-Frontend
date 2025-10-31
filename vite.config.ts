import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import fs from 'fs'
import path from 'path'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'copy-redirects',
            writeBundle() {
                const srcPath = path.resolve(__dirname, 'public/_redirects')
                const destPath = path.resolve(__dirname, 'dist/_redirects')
                if (fs.existsSync(srcPath)) {
                    fs.copyFileSync(srcPath, destPath)
                    console.log('✓ _redirects file copied to dist/')
                }
            }
        }
    ],
    
    publicDir: 'public',
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

            'motion/react': 'framer-motion',
        },
    },
    
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
