// server.js (ES module version)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 3000;

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
    secret: 'your-secret-key', // In a real app, use a secure secret from environment variables
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock user data for authentication
const mockUsers = [
    {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123', // In a real app, you would hash passwords
        appliedInternships: [],
        profile: {
          university: 'Stanford University',
          phone: '+1 (555) 123-4567'
        }
    }
];

// Function to check if a user exists
function findUserByEmail(email) {
    return mockUsers.find(user => user.email === email);
}

// Function to create a new user
function createUser(userData) {
    const newUser = {
        id: Date.now().toString(),
        ...userData,
        appliedInternships: [],
        profile: {}
    };
    mockUsers.push(newUser);
    return newUser;
}

// Mock authentication functions based on AuthContext
const mockAuth = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = findUserByEmail(email);
    if (user && password === 'password123') { // Simple check for demo
      return {
        success: true,
        user
      };
    }
    return {
      success: false
    };
  },

  signup: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (findUserByEmail(email)) {
      return {
        success: false
      };
    }
    const newUser = createUser({ name, email, password });
    return {
      success: true,
      user: newUser
    };
  }
};

// Login route - GET
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login route - POST
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please fill in all fields' });
  }

  try {
    const result = await mockAuth.login(email, password);
    if (result.success) {
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Invalid credentials. Please try again.' });
    }
  } catch (error) {
    res.render('login', { error: 'An error occurred. Please try again.' });
  }
});

// Signup route - GET
app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Signup route - POST
app.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword, agreeTerms } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.render('signup', { error: 'Please fill in all fields' });
  }

  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.render('signup', { error: 'Password must be at least 6 characters long' });
  }

  if (!agreeTerms) {
    return res.render('signup', { error: 'Please agree to the terms and conditions' });
  }

  try {
    const result = await mockAuth.signup(name, email, password);
    if (result.success) {
      res.redirect('/dashboard');
    } else {
      res.render('signup', { error: 'Failed to create account. Please try again.' });
    }
  } catch (error) {
    res.render('signup', { error: 'An error occurred. Please try again.' });
  }
});

// Home route
app.get('/', (req, res) => {
    res.render('home', {
        user: req.session.user || null
    });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    // In a real implementation, you would check if the user is authenticated
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    res.render('dashboard', {
        user: req.session.user
    });
});

// Internships route
app.get('/internships', (req, res) => {
    res.render('internships', {
        user: req.session.user || null
    });
});

// Internship detail route
app.get('/internship/:id', (req, res) => {
    const internshipId = req.params.id;
    res.render('internship-detail', {
        user: req.session.user || null,
        internshipId: internshipId
    });
});

// Serve React app for all other routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
