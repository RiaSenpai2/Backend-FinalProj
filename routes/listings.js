const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// POST route to create a new listing
router.post('/', async (req, res) => {
  const newListing = new Listing(req.body);
  try {
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// GET route to fetch all listings
router.get('/', async (req, res) => {
    try {
      const listings = await Listing.find();
      res.json(listings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
