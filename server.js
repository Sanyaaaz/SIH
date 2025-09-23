const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const Internship = require('./models/Internships');
//----------------- DB CONNECTION -----------------
// mongoose.connect('mongodb://127.0.0.1:27017/IH', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error(err));
mongoose.connect( 'mongodb+srv://saniyaarora2908_db_user:saniya-2908@cluster0.ylwkohw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB Atlas Connected'))
.catch(err => console.error('MongoDB connection error:', err));
const app = express();
const PORT = process.env.PORT || 3000;

// ----------------- VIEW ENGINE -----------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----------------- MIDDLEWARE -----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// ----------------- PASSPORT CONFIG -----------------
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'No user found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// ----------------- ROUTES -----------------

// Home route
app.get('/', (req, res) => {
  res.render('student/home', { user: req.user || null });
});

// Redirect old resources path to new dashboard path (if used anywhere)
app.get('/resources', (req, res) => {
  res.redirect('/dashboard/resources');
});

// Login routes
app.get('/auth/login', (req, res) => {
  res.render('login', { error: null });
});

// app.post('/auth/login', passport.authenticate('local', {
//   successRedirect: '/dashboard',
//   failureRedirect: '/auth/login',
//   // failureFlash: true
// }));
app.post('/auth/login', passport.authenticate('local'), (req, res) => {
  // Role-based redirection after successful login
  if (req.user.role === 'industry') {
    res.redirect('/industry/dashboard');
  } else if (req.user.role === 'faculty') {
    res.redirect('/faculty/dashboard');
  } else {
    res.redirect('/dashboard'); // Default to student dashboard
  }
});

// Signup routes
app.get('/auth/signup', (req, res) => {
  res.render('signup', { error: null });
});

app.post('/auth/signup', async (req, res) => {
  console.log('Signup request received:', req.body);
  
  const { name, email, password, confirmPassword, role, abcId } = req.body;

  if (!name || !email || !password || !confirmPassword || !role) {
    console.log('Missing fields error');
    return res.render('signup', { error: 'Please fill all required fields' });
  }
  
  if (password !== confirmPassword) {
    console.log('Password mismatch error');
    return res.render('signup', { error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists - redirecting to login');
      // Option 1: Redirect to login with a message
      return res.redirect('/auth/login?message=user-exists');
      
      // Option 2: Show error on signup page (current behavior)
      // return res.render('signup', { error: 'Email already registered' });
    }

    const newUser = new User({ name, email, role, password, abcId });
    await newUser.save();
    console.log('User saved successfully:', newUser._id);

    // Auto-login after successful signup
    req.login(newUser, (err) => {
      if (err) {
        console.error('Login error after signup:', err);
        return res.redirect('/auth/login');
      }
      console.log('Auto-login successful, redirecting to dashboard');
      //res.redirect('/dashboard');
      if (newUser.role === 'industry') {
        res.redirect('/industry/dashboard');
      } else if (newUser.role === 'faculty') {
        res.redirect('/faculty/dashboard');
      } else {
        res.redirect('/dashboard'); 
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.render('signup', { error: 'Something went wrong. Try again.' });
  }
});

// Protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

// Dashboard
// app.get('/dashboard', ensureAuthenticated, (req, res) => {
//   res.render('student/dashboard', { user: req.user });
// });
app.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    // Fetch recent internships for the dashboard
    const internships = await Internship.find()
      .populate('company', 'name email')
      .sort({ postedAt: -1 })
      .limit(6); // Show only 6 recent internships on dashboard
      
    res.render('student/dashboard', { 
      user: req.user, 
      internships: internships,
      active: 'dashboard'
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.render('student/dashboard', { 
      user: req.user, 
      internships: [],
      active: 'dashboard'
    });
  }
});
// Post internship (industry users)
app.post('/api/internships', ensureAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'industry') {
      return res.status(403).json({ error: 'Only industry users can post internships' });
    }

    const { title, description, location, stipend, duration } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newInternship = new Internship({
      title,
      description,
      company: req.user._id,
      location,
      stipend,
      duration
    });

    await newInternship.save();
    res.status(201).json({ 
      message: 'Internship posted successfully', 
      internship: newInternship 
    });

  } catch (error) {
    console.error('Error posting internship:', error);
    res.status(500).json({ error: 'Failed to post internship' });
  }
});

// Fetch internships API
app.get('/api/internships', async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('company', 'name email')
      .populate('applicants', 'name email')
      .sort({ postedAt: -1 });

    res.json({ internships });

  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});
app.get('/student/dashboard', ensureAuthenticated, async (req, res) => {
  if (req.user.role !== 'student') return res.redirect('/auth/login');
  
  try {
    // Fetch recent internships for the dashboard
    const internships = await Internship.find()
      .populate('company', 'name email')
      .sort({ postedAt: -1 })
      .limit(6); // Show only 6 recent internships on dashboard
      
    res.render('student/dashboard', { 
      user: req.user, 
      internships: internships,
      active: 'dashboard'
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.render('student/dashboard', { 
      user: req.user, 
      internships: [],
      active: 'dashboard'
    });
  }
});
// Student Resources
app.get('/dashboard/resources', ensureAuthenticated, (req, res) => {
  res.render('student/resources', { title: 'Resources', page: 'resources', user: req.user, resources: [] });
});

// Student Progress
app.get('/progress', ensureAuthenticated, (req, res) => {
  res.render('student/resources', { title: 'Progress', page: 'progress', user: req.user });
});

// Student Bookmarks
app.get('/bookmarks', ensureAuthenticated, (req, res) => {
  res.render('student/resources', { title: 'Bookmarks', page: 'bookmarks', user: req.user });
});

// Student Index (uses same layout with index content)
app.get('/student', ensureAuthenticated, (req, res) => {
  res.render('student/resources', { title: 'Student', page: 'index', user: req.user });
});

// Internships list
app.get('/internships', (req, res) => {
  res.render('student/internships', { user: req.user || null });
});
app.get('/industry/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'industry') {
    return res.redirect('/dashboard'); 
  }
  res.render('industry/dashboard', { user: req.user });
});

app.get('/post-internship', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'industry') {
    return res.redirect('/dashboard');
  }
  res.render('industry/post-internship', { user: req.user });
});

app.get('/manage-applications', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'industry') {
    return res.redirect('/dashboard');
  }
  res.render('industry/manage-applications', { user: req.user });
});

app.get('/analytics', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'industry') {
    return res.redirect('/dashboard');
  }
  res.render('industry/analytics', { user: req.user });
});

app.get('/feedback', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'industry') {
    return res.redirect('/dashboard');
  }
  res.render('industry/feedback', { user: req.user });
});
app.get('/faculty/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.redirect('/dashboard'); 
  }

  const analytics = {
    totalStudents: 45,
    internshipsSecured: 23,
    certificatesIssued: 18,
    ongoingCourses: 3,
    monthlyData: [2, 4, 3, 5, 7, 6, 8, 9, 7, 11, 8, 12]
  };
  
  const notifications = [
    {
      type: 'company_accept',
      message: 'TechCorp accepted your partnership request',
      time: '2 hours ago'
    },
    {
      type: 'lor_request',
      message: 'Sarah Johnson requested a Letter of Recommendation',
      time: '4 hours ago'
    },
    {
      type: 'certificate_approve',
      message: 'Certificate approval needed for 3 students',
      time: '1 day ago'
    }
  ];
  
  res.render('faculty/dashboard', { 
    user: req.user,
    analytics: analytics,
    notifications: notifications,
    active: 'dashboard',
    title: 'Faculty Dashboard'
  });
});

app.get('/companies', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.redirect('/dashboard');
  }
  res.render('faculty/companies', { 
    user: req.user, 
    active: 'companies',
    title: 'Companies'
  });
});

app.get('/students', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.redirect('/dashboard');
  }
  res.render('faculty/students', { 
    user: req.user, 
    active: 'students',
    title: 'Students'
  });
});

app.get('/resources', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.redirect('/dashboard');
  }
  res.render('faculty/resources', { 
    user: req.user, 
    active: 'resources',
    title: 'Resources'
  });
});
// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

// Internship detail
app.get('/internship/:id', (req, res) => {
  res.render('student/internship-detail', { user: req.user || null });
});
// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

