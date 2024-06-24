/* Custom Vite plugin for Handlebars :)
 * Place templates in src/templates please
 */

import { exec } from 'child_process'
import chokidar from 'chokidar'

export default function handlebars (options = {}) {
  const templatesDir = options.templatesDir || 'src/templates/'
  const outputFile = options.outputFile || 'src/compiled-templates.js'
  return {
    name: 'vite-plugin-handlebars-precompile',
    configureServer (server) {
      // Watch the templates directory
      const watcher = chokidar.watch('**/*.hbs')
      watcher.on('change', async (path) => {
        console.log(`File ${path} changed, precompiling Handlebars templates...`)
        exec(`handlebars ${templatesDir} -e hbs -f ${outputFile}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error precompiling templates: ${stderr}`)
          } else {
            console.log(`Templates precompiled successfully: ${stdout}`)
            server.ws.send({
              type: 'full-reload'
            })
          }
        })
      })
    }
  }
}
