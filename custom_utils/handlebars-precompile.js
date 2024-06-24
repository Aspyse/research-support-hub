/* EXTREMELY HACKY
 */
import fs from 'fs'

const source = fs.readFileSync('src/compiled-templates.js')
fs.writeFileSync('src/compiled-templates.js',`
import Handlebars from 'handlebars'
${source}`)