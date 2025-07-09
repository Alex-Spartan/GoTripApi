const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const authRouter = require('./router/auth.js');
const accomodationRouter = require('./router/accomodationForm.js');
const bookingRouter = require('./router/booking.js')

const app = express();
const port = 3000;

app.use(cors({
  credentials: true,
  origin: ["http://localhost:5173", process.env.CLIENT_URI]
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

app.get('/health', (req, res) => {
    res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// Add to your backend
app.use('/auth', authRouter);
app.use('/places', accomodationRouter);
app.use('/bookings', bookingRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});