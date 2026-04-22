/**
 * SECURE BACKEND API WITH JWT AUTHENTICATION & RBAC
 * Single-file working version for testing in Postman
 */

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4000;
const SECRET_KEY = 'super_secret_key_123'; // In production, use environment variables!

// Middleware to parse JSON bodies
app.use(express.json());

// -----------------------------------------------------------
// 1. JWT VERIFICATION MIDDLEWARE
// -----------------------------------------------------------
const verifyToken = (req, res, next) => {
  // Read token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Access denied: No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Attach decoded user data (id and role) to the request object
    req.user = decoded;
    next(); // Move to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// -----------------------------------------------------------
// 2. ROLE-BASED AUTHORIZATION MIDDLEWARE
// -----------------------------------------------------------
const isAdmin = (req, res, next) => {
  // Check if the user role attached by verifyToken is "admin"
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

// -----------------------------------------------------------
// 3. AUTHENTICATION ROUTES
// -----------------------------------------------------------

/**
 * @route   POST /login
 * @desc    Authenticate user and return JWT
 */
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Mock Authentication Logic
  let role = 'user';
  if (email === 'admin@gmail.com') {
    role = 'admin';
  }

  // Generate JWT Token
  const userData = {
    userId: Date.now(), // Mock user ID
    email: email,
    role: role
  };

  const token = jwt.sign(userData, SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({
    message: 'Login successful',
    token: token,
    role: role
  });
});

// -----------------------------------------------------------
// 4. PROTECTED ROUTES
// -----------------------------------------------------------

/**
 * @route   GET /admin
 * @desc    Only accessible by Admin
 */
app.get('/admin', verifyToken, isAdmin, (req, res) => {
  res.status(200).json({
    message: 'Welcome Admin',
    adminData: 'Sensitive information here...'
  });
});

/**
 * @route   GET /user
 * @desc    Accessible by any logged-in user
 */
app.get('/user', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Welcome User',
    userData: req.user
  });
});

// Standard 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🔑 Login with admin@gmail.com to get an Admin token`);
  console.log(`👤 Login with any other email to get a User token\n`);
});
