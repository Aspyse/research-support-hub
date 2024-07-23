/* This file manages our HTTP routes.
 * Firebase functions are also used here.
 */

import express from 'express'

// Firebase
import { auth, db, firebaseConfig } from './firebase.js'
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
      'firebase.js',
      'home.js'
    ],
    firebaseConfig,
    auth,
    db
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
      'firebase.js',
      'profile.js'
    ],
    firebaseConfig,
    auth,
    db
  })
})

// login Route
router.get('/login', async (req, res) => {
  res.render('login', {
    layout: 'index',
    title: 'login Page',
    styles: [ // Include every style used when rendering this page.
      'main.css',
      'login.css'
    ],
    scripts: [ // Include every script used by the page.
      'login.js'
    ],
    firebaseConfig,
    auth,
    db
  })
})

// register Route
router.get('/register', async (req, res) => {
  res.render('register', {
    layout: 'index',
    title: 'register Page',
    styles: [ // Include every style used when rendering this page.
      'main.css',
      'register.css'
    ],
    scripts: [ // Include every script used by the page.
      'register.js'
    ],
    firebaseConfig,
    auth,
    db
  })
})

export { router }
