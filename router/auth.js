const express = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 10)
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const isMatch = bcrypt.compare(password, user.password);

        if (user && isMatch) {
            jwt.sign({ email: email, id: user._id, name: user.name }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Internal Server Error")
                }
                res.cookie('token', token).status(200).send(user)
            })
        } else {
            res.status(401).send("Invalid")
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/profile', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, process.env.JWT_KEY, {}, async (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (!data) return res.status(401).json("Unauthorized");
                const user = await User.findById(data._id)
                res.status(200).json(user)
            })
        } else {
            res.json(null)
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/logout', (req, res) => {
    try {
        res.cookie("token", "");
        res.status(200).json("deleted");
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;