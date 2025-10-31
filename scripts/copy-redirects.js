import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.resolve(__dirname, '../public/_redirects');
const destPath = path.resolve(__dirname, '../dist/_redirects');

if (fs.existsSync(srcPath)) {
    
    const distDir = path.dirname(destPath);
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    fs.copyFileSync(srcPath, destPath);
    console.log('✓ Successfully copied _redirects to dist folder');
} else {
    console.warn('⚠ _redirects file not found in public folder');
}
