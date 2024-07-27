import express from 'express';

const router = express.Router();

// Sample Route
router.get('/', async (req, res) => {
  res.render('home', {
    layout: 'index',
    title: 'Home Page',
    styles: ['header.css', 'header2.css', 'main.css'],
    scripts: ['home.js','main.js']
  });
});

router.get('/profile', async (req, res) => {
  res.render('profile', {
    layout: 'index',
    title: 'Profile Page',
    styles: ['main.css', 'header.css', 'header2.css'],
    scripts: ['profile.js','main.js']
  });
});

// login Route
router.get('/login', async (req, res) => {
  res.render('login', {
    layout: 'index',
    title: 'Login Page',
    styles: ['main.css', 'login.css', 'header.css', 'header2.css'],
    scripts: ['login.js','main.js']
  });
});

// register Route
router.get('/register', async (req, res) => {
  res.render('register', {
    layout: 'index',
    title: 'Register Page',
    styles: ['main.css', 'register.css', 'header.css', 'header2.css'],
    scripts: ['register.js','main.js']
  });
});

router.get('/res-req', async (req, res) => {
  res.render('res-req', {
    layout: 'index',
    title: 'Research Request',
    styles: ['main.css', 'register.css', 'header.css', 'header2.css'],
    scripts: ['res-req.js', 'main.js']
  });
});

router.get('/res-resources', async (req, res) => {
  res.render('res-resources', {
    layout: 'index',
    title: 'Research Resources',
    styles: ['main.css', 'res-resources.css', 'header.css', 'header2.css'],
    scripts: ['res-resources.js', 'main.js']
  });
});

router.get('/res-details/:id', async (req, res) => {
  res.render('res-details', {
    layout: 'index',
    title: 'Research Details',
    styles: ['main.css', 'res-details.css', 'header.css', 'header2.css'],
    scripts: ['res-details.js', 'main.js'],
    researchId: req.params.id,
    userId: req.query.userId || ''
  });
});

router.get('/edit-research/:id', async (req, res) => {
  res.render('edit-research', {
    layout: 'index',
    title: 'Edit Research Request',
    styles: ['main.css', 'edit-research.css', 'header.css', 'header2.css'],
    scripts: ['edit-research.js', 'main.js'],
    researchId: req.params.id
  });
});

export { router };
