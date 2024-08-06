import express from 'express';
import { sendNotification } from './firebaseAdmin.js';

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
    styles: ['main.css', 'res-request.css', 'header.css', 'header2.css'],
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

router.get('/admin', async (req, res) => {
  res.render('admin', {
      layout: 'index',
      title: 'Admin Dashboard',
      styles: ['main.css', 'admin.css','header.css', 'header2.css'],
      scripts: ['admin.js', 'main.js']
  });
});

router.get('/faq', async (req, res) => {
  res.render('faq', {
      layout: 'index',
      title: 'FAQ Page',
      styles: ['main.css', 'faq.css', 'header.css', 'header2.css'],
      scripts: ['faq.js', 'main.js']
  });
});

router.get('/about-us', async (req, res) => {
  res.render('about-us', {
      layout: 'index',
      title: 'About ',
      styles: ['main.css', 'about-us.css','header.css', 'header2.css'],
      scripts: ['about-us.js', 'main.js']
  });
});

router.post('/sendNotification', async (req, res) => {
  const { registrationToken, title, body, data } = req.body;

  try {
      await sendNotification(registrationToken, title, body, data);
      res.status(200).send('Notification sent successfully!!!');
  } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification');
  }
});

export { router };
