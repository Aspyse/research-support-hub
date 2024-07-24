import express from 'express';

const router = express.Router();

// Sample Route
router.get('/', async (req, res) => {
  res.render('home', {
    layout: 'index',
    title: 'Home Page',
    styles: [ 
      'main.css'
    ],
    scripts: [ 
      'home.js',
      'main.js'
    ]
  })
})

router.get('/profile', async (req, res) => {
  res.render('profile', {
    layout: 'index',
    title: 'Profile Page',
    styles: [ 
      'main.css'
    ],
    scripts: [ 
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
    styles: [ 
      'main.css',
      'login.css'
    ],
    scripts: [
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
    styles: [
      'main.css',
      'register.css'
    ],
    scripts: [
      'register.js',
      'main.js'
    ]
  });
});

router.get('/res-req', async (req, res) => {
  res.render('res-req', {
    layout: 'index',
    title: 'Research Request',
    styles: ['main.css', 'register.css'],
    scripts: ['res-req.js']
  });
});

router.get('/res-resources', async (req, res) => {
  res.render('res-resources', {
    layout: 'index',
    title: 'Research Resources',
    styles: ['main.css', 'res-resources.css'],
    scripts: ['res-resources.js']
  });
});

router.get('/research-details/:id', async (req, res) => {
  res.render('research-details', {
    layout: 'index',
    title: 'Research Details',
    styles: ['main.css', 'research-details.css'],
    scripts: ['research-details.js'],
    researchId: req.params.id,
    userId: req.query.userId || ''
  });
});

export { router };
