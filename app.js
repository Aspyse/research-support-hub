/* The Research Support Hub
 * by 1233 CSSWENG S16 Group 10
 *
 * On first use, run npm install
 * To launch app, run npm run dev
 */
import 'dotenv/config'
import path from 'path'
import express from 'express'
import handlebars from 'express-handlebars'

// Router
import { router } from './server/routes.js'

const PORT = process.env.PORT || 3030
const NODE_ENV = process.env.NODE_ENV || 'development'
const __dirname = import.meta.dirname;

const app = express()

// Express-handlebars setup
app.engine('hbs', handlebars.engine({
  extname: 'hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// The public folder is served to the client-side.
app.use(express.static(path.join(__dirname, 'public')))
app.use(router)

// Listen on localhost
app.listen(PORT, function () {
  console.log('Listening at localhost:' + PORT + '/')
})
