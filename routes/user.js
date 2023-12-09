const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as needed
const router = express.Router();

const saltRounds = 10;

// Route to handle user registration
router.post('/register', async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const userExists = await User.findOne({ email: email });
  
  if (userExists) {
    return res.status(400).json({ message: 'Email address already exists' });
  }

  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Incomplete data' });
  }

  try {
    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ fname, lname, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // You might want to exclude the password from the response
    savedUser.password = undefined;
    
    res.status(200).json({ status: 'ok', user: savedUser });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Route to handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Comparing hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // You might want to exclude the password from the response
    user.password = undefined;

    res.status(200).json({ status: 'ok', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;

