/* The Research Support Hub
 * by 1233 CSSWENG S16 Group 10
 *
 * On first use, run npm install
 * To launch app, run npm run dev
 */

import path from 'path'
import express from 'express'
const app = express()

import handlebars from 'express-handlebars'
app.engine('hbs', handlebars.engine({
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '../../dist')))

// Sample route
app.get('/', async (req, res) => {
  res.render('main', {
    title: 'Sample Page',
    layout: 'index'
  })
})

// Listen on localhost