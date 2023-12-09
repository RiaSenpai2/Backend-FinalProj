const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


const adminCredentials = {
  email: "admin@gmail.com",
  password: "$2b$10$KY13AjaMy7k50fkfN2eGDOjBxX5qVSGIYOUKK2q2VW5gCgb/ySgq2" // Test@1234
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === adminCredentials.email) {
    const passwordMatch = await bcrypt.compare(password, adminCredentials.password);
    if (passwordMatch) {
      res.json({ status: 'ok', message: 'Admin login successful' });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;
