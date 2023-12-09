require('dotenv').config();


const Order = require('./models/Order'); // Make sure the path is correct

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRoutes = require('./routes/admin');
const bcrypt = require('bcryptjs'); // Import bcryptjs

const User = require('./models/User'); // Import the User model
const Listing = require('./models/Listing'); // Import the Listing model

const app = express();
const Razorpay = require("razorpay");

// Middleware
app.use(cors({
  origin: 'https://frontend-final-proj-l2bn.vercel.app' // Replace with your frontend's URL
}));
// app.use(cors({
//   origin: 'http://localhost:3000' // Replace with your frontend's URL
// }));

app.use(cors())
app.use(bodyParser.json()); 
// Connect to MongoDB

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/finalProjDb'
const dbUrl = process.env.DB_URL

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define routes
const userRoutes = require('./routes/user'); // Ensure the path is correct
const listingsRoutes = require('./routes/listings'); // Ensure the path is correct

// Use routes
app.use('/api/user', userRoutes); // Routes for user operations (register, login)
app.use('/api/listings', listingsRoutes); // Routes for listings operations
app.use('/api/admin', adminRoutes)


app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find(); // Retrieve users from the database
    res.status(200).json(users); // Send the users as a JSON response
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message }); // Handle potential errors
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find(); // Fetch all listings from MongoDB
    res.status(200).json(listings); // Send the listings as a response
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message }); // Handle potential errors
  }
});

app.delete("/api/user/:id", async (req, res) => {
  const { id } = req.params; // Extract the user ID from request parameters

  try {
    // Find the user by ID and delete it from the database
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({ status: 'ok', message: 'User deleted successfully', deletedUser });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  const { id } = req.params; // Extract the listing ID from request parameters

  try {
    // Find the listing by ID and delete it from the database
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ status: 'error', message: 'Listing not found' });
    }

    res.status(200).json({ status: 'ok', message: 'Listing deleted successfully', deletedListing });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


app.put('/api/user/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Incorrect old password' });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();

    res.status(200).json({ status: 'ok', message: 'Password updated successfully' });
    
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


// app.get("/api/listings", async (req, res) => {
//   try {
//     const email = req.params.email;
//     const user = await User.findOne({ email: email });

//     if (!user) {
//       return res.status(404).json({ status: 'error', message: 'User not found' });
//     }

//     console.log("User found:", user); // Debugging log

//     const userlistings = await Listing.find({ userId: user._id });
//     console.log("Listings found:", userlistings); // Debugging log

//     res.status(200).json(userlistings);
//   } catch (err) {
//     console.error("Error:", err); // Debugging log
//     res.status(500).json({ status: "error", message: err.message });
//   }
// });



// // PUT route to update a user by email
// app.put("/api/user/update/:email", async (req, res) => {
//   const { email } = req.params; // Extract the user email from request parameters
//   const updatedData = req.body; // Extract updated data from the request body

//   try {
//     // Find the user by email and update their details
//     const updatedUser = await User.findOneAndUpdate({ email: email }, updatedData, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ status: 'error', message: 'User not found' });
//     }

//     res.status(200).json({ status: 'ok', message: 'User updated successfully', updatedUser });
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: err.message });
//   }
// });



// ... Other routes as needed
app.post("/order",async (req, res)=> {
  const instance = new Razorpay({
    key_id: "rzp_test_0hFrUxLaA2mPxN",
    key_secret: "SGwjVkRYY48G7COiQhiikzmV",
});

const { v4: uuidv4 } = require('uuid');
console.log('Request for order endpoint - ')
console.log(req.body)
const {amount} = req.body;

const receiptId = uuidv4();

const options = {
    amount: amount*100,
    currency: "USD",
    receipt: receiptId,
};
console.log('Request going to rzpay - ')
console.log(options)
try {
  const order = await instance.orders.create(options);
  console.log('Response form rzpay - ')
  console.log(order)

if (!order) return res.status(500).send("Some error occured");

res.json(order);
} catch(e) {
  console.log(e)
}
})

app.post("/order/success", async(req, res) => {
console.log("success request for order - ")
console.log(req.body)

const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

// Create a new order object
const newOrder = new Order({
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    // Include additional data if needed, like amount, user details, etc.
});
console.log(newOrder)
try {
    // Save the order in the database
    const savedOrder = await newOrder.save();
    res.status(200).json({ status: 'ok', message: 'Order saved successfully', order: savedOrder });
} catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ status: 'error', message: error.message });
}
});






app.delete("/api/listings/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const deletedListing = await Listing.findByIdAndDelete(id);
      if (!deletedListing) {
          return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



