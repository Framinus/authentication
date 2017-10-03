const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const pug = require('pug');
const bcrypt = require('bcrypt');
const path = require('path');
const { addUser, findUser } = require('./database/queries.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  const name = req.cookies.name;
  if (name) {
    res.render('index', { name });
  } else {
    res.render('choice');
  }
});

app.get('/choice', (req, res) => {
  res.render('choice');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).then(function(hash) {
    addUser(name, email, hash);
});
  res.cookie('name', req.body.name);
  res.redirect('/');
});

// this function is not working.
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  findUser(email)
  .then(data => {
    bcrypt.compare(password, data.password).then((result) => {
    if (result) {
      res.cookie('name', data.name);
      res.redirect('/')
    } else {
      res.render('loginerror');
    }
    })
  })
  .catch(err => {
    console.log('user not found');
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('name');
  res.redirect('/choice');
});

app.listen(3000, () => {
  console.log('The application is running on port 3000');
});
