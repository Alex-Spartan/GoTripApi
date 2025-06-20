const { Router } = require('express');
const download = require('image-downloader');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// const { storage } = require('../firebase');


const Accomodation = require('../models/Accomodation');


const router = Router();



router.post('/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const formData = req.body;
    try {
        if (!id) {
            return res.status(400).json({ error: "Id not provided" });
        }
        const data = await Accomodation.findById(id);
        if (!data) {
            return res.status(404).json({ error: "Accomodation not found" });
        }
        const room = new Room(formData);
        room.accomodation = id;
        data.rooms = room._id;
        await room.save();
        await data.save();
        res.status(201).json({ message: "Room created successfully", error: false, room });
    } catch (err) {
        res.status(500).json({ message: err.message, error: true });
    }
})

router.delete('/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const { placeId } = req.query;
    try {
        const data = await Accomodation.findById(placeId);
        if (!data) {
            return res.status(404).json({ error: "Accomodation not found" });
        }
        data.rooms = data.rooms.filter(room => room._id != id);
        await data.save();
        res.json({ message: "Room deleted", roomId: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

//Accomodations

router.get('/accomodation', async (req, res) => {
    try {
        const data = await Accomodation.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/accomodation', async (req, res) => {
    try {
        const formData = req.body;
        if (!formData.title || !formData.address) {
            return res.status(400).json({ message: "Title and address are required", error: true });
        }
        const accomodation = new Accomodation(formData);
        await accomodation.save();
        res.status(201).json({ message: "Accomodation created successfully", error: false });
    } catch (err) {
        res.status(500).json({ message: err.message, error: true });
    }
});

router.get('/accomodation/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Accomodation.findById(id);
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/accomodation/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        if (!id) {
            return res.status(400).json({ error: "Id not provided" });
        }
        const data = await Accomodation.findById(id);
        if (!data) {
            return res.status(404).json({ error: "Accomodation not found" });
        }
        const updatedAccomodation = await Accomodation.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedAccomodation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;