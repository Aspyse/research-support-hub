import { defineConfig } from 'vite'
import handlebars from './custom_utils/vite-plugin-handlebars.js'

export default defineConfig({
  plugins: [
    handlebars({
      templatesDir: 'src/templates',
      outputFile: 'src/compiled-templates.js'
    })
  ]
})
