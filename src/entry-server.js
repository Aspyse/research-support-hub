/* This file is run by server.js
 * when asked to render a page
 */
import javascriptLogo from './javascript.svg'
import Handlebars from 'handlebars'
import template from './compiled-templates.js'


export async function render () {
  const html = Handlebars.templates['home']({ logo: javascriptLogo })

  return { html }
}
