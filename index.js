const express = require('express');
const Router = express.Router;
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const authRouter = require('./router/auth.js');
const accomodationRouter = require('./router/accomodationForm.js');
const bookingRouter = require('./router/booking.js')
//kbs9Fq4X4BIsJqqV
const app = express();
const port = 3000;
const router = Router();
app.use(cors({
    credentials: true,
    origin: [
        'https://client-a9quu63pa-alex-spartans-projects.vercel.app', 
        'https://client-omega-indol.vercel.app'
    ]
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

app.get('/test', (req, res) => {
    res.send('Hello, World!');
});

app.use('/auth', authRouter);
app.use('/places', accomodationRouter);
app.use('/booking', bookingRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});