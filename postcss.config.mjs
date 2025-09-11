
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

// Export PostCSS plugins as an array of plugin functions (ESM-compatible)
export default {
  plugins: [tailwindcss(), autoprefixer()],
}
