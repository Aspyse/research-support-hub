/* This file manages our HTTP routes.
 * Firebase functions are also used here.
 */

import express from 'express'

// Firebase
import { auth, db } from './firebase.js'
const router = express.Router()

// Sample Route
router.get('/', async (req, res) => {
  res.render('sample', {
    layout: 'index',
    title: 'Sample Page',
    styles: [ // Include every style used when rendering this page.
      'main.css',
      'sample.css',
      'sample-partial.css'
    ],
    scripts: [ // Include every script used by the page.
      'main.js',
      'sample-partial.js'
    ]
  })
})

export { router }
