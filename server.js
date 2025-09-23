const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;

mongoose.connect('mongodb://127.0.0.1:27017/IH', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));


const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//passport

// Passport config
passport.use(new LocalStrategy(
  { usernameField: 'identifier', passReqToCallback: true },
  async (req, identifier, password, done) => {
    try {
      
      const user = await User.findOne({
        $or: [{ email: identifier }, { abcId: identifier }]
      });

      if (!user) return done(null, false, { message: 'No user found with this Email/ABC ID' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware for passport
app.use(passport.initialize());
app.use(passport.session());


// Login route - GET
app.get('/auth/login', (req, res) => {
  res.render('login', { error: null });
});


app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.render('login', { error: info.message });

    req.logIn(user, err => {
      if (err) return next(err);

      // Redirect based on role
      if (user.role === 'student') return res.redirect('/student/dashboard');
      if (user.role === 'faculty') return res.redirect('/faculty/dashboard');
      if (user.role === 'industry') return res.redirect('/industry/dashboard');

      return res.redirect('/dashboard'); // fallback
    });
  })(req, res, next);
});


// Signup route - GET
app.get('/auth/signup', (req, res) => {
  res.render('signup', { error: null });
});


app.post('/auth/signup', async (req, res) => {
  const { name, email, abcId, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword || !role) {
    return res.render('signup', { error: 'Please fill all fields' });
  }
  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'Email already registered' });
    }

    const newUser = new User({ name, email, abcId, role, password });
    await newUser.save();

    req.login(newUser, err => {
      if (err) return res.render('signup', { error: 'Error logging in after signup' });
      res.redirect('/dashboard');
    });
  } catch (error) {
    res.render('signup', { error: 'Something went wrong. Try again.' });
  }
});

//Home route
app.get('/', (req, res) => {
    res.render('student/home', {
        user: req.session.user || null
    });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('student/dashboard', { user: req.user });
});


// // Dashboard route
// app.get('/dashboard', (req, res) => {
//     // In a real implementation, you would check if the user is authenticated
//     if (!req.session.user) {
//         return res.redirect('/login');
//     }
    
//     res.render('dashboard', {
//         user: req.session.user
//     });
// });

// // Internships route
// app.get('/internships', (req, res) => {
//     res.render('internships', {
//         user: req.session.user || null
//     });
// });

// // Internship detail route
// app.get('/internship/:id', (req, res) => {
//     const internshipId = req.params.id;
//     res.render('internship-detail', {
//         user: req.session.user || null,
//         internshipId: internshipId
//     });
// });


//DASHBOARD - ROLE BASED - abhi bana nhi h dashboard , change baadme
app.get('/student/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'student') return res.redirect('/auth/login');
  res.render('student/dashboard', { user: req.user });
});

app.get('/faculty/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'faculty') return res.redirect('/auth/login');
  res.render('faculty/dashboard', { user: req.user });
});

app.get('/industry/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'industry') return res.redirect('/auth/login');
  res.render('industry/dashboard', { user: req.user });
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
