/* This file manages our HTTP routes.
 * Firebase functions are also used here.
 */

import express from 'express'

// Firebase
const router = express.Router()

// Sample Route
router.get('/', async (req, res) => {
  res.render('home', {
    layout: 'index',
    title: 'Home Page',
    styles: [ // Include every style used when rendering this page.
      'main.css'
    ],
    scripts: [ // Include every script used by the page.
      'home.js',
      'main.js'
    ]
  })
})

router.get('/profile', async (req, res) => {
  res.render('profile', {
    layout: 'index',
    title: 'Profile Page',
    styles: [ // Include every style used when rendering this page.
      'main.css'
    ],
    scripts: [ // Include every script used by the page.
      'profile.js',
      'main.js'
    ]
  })
})

// login Route
router.get('/login', async (req, res) => {
  res.render('login', {
    layout: 'index',
    title: 'Login Page',
    styles: [ // Include every style used when rendering this page.
      'main.css',
      'login.css'
    ],
    scripts: [ // Include every script used by the page.
      'login.js',
      'main.js'
    ]
  })
})

// register Route
router.get('/register', async (req, res) => {
  res.render('register', {
    layout: 'index',
    title: 'Register Page',
    styles: [ // Include every style used when rendering this page.
      'main.css',
      'register.css'
    ],
    scripts: [ // Include every script used by the page.
      'register.js',
      'main.js'
    ]
  })
})

export { router }
