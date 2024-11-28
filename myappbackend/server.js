const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// Database connection
mongoose.connect('mongodb://localhost:27017/hotelbooking', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Models
const Hotel = mongoose.model('Hotel', new mongoose.Schema({
    name: String,
    location: String,
    price: Number,
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    userName: String,
    checkIn: String,
    checkOut: String,
    confirmationMessage: String,
}));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Get all hotels
app.get('/hotels', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch hotels' });
    }
});

// Add a new hotel (Admin)
app.post('/hotels', async (req, res) => {
    try {
        const { name, location, price } = req.body;
        const newHotel = new Hotel({ name, location, price });
        await newHotel.save();
        res.json(newHotel);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add hotel' });
    }
});

// Book a hotel and store the confirmation
// POST /bookings
app.post('/bookings', (req, res) => {
    const { hotelId, name, email, checkIn, checkOut, guests } = req.body;

    // Validate and save the booking to your database
    const newBooking = { hotelId, name, email, checkIn, checkOut, guests };

    // Example response
    res.status(201).json({ message: 'Booking confirmed!', booking: newBooking });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
