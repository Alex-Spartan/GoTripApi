const { Router } = require('express');
const download = require('image-downloader');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const Accomodation = require('../models/Accomodation')


const router = Router();
const photosMiddleware = multer({ dest: 'uploads' })

router.post('/image-upload', async (req, res) => {
    const { url, id } = req.body;
    const imagesDir = path.join(__dirname, `../uploads/${id}`);
    const date = Date.now();
    const filename = path.join(imagesDir, `${date}.jpg`);
    const options = {
        url: url,
        dest: filename
    }
    try {
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }
        await download.image(options);
        res.json(`${id}/${date}.jpg`);
    } catch (err) {
        res.json({ error: err });
    }
})


router.post('/room/image-upload', async (req, res) => {
    const { url, id } = req.body;
    const imagesDir = path.join(__dirname, `../uploads/${id}/room`);
    const date = Date.now();
    const filename = path.join(imagesDir, `${date}.jpg`);
    const options = {
        url: url,
        dest: filename
    }
    try {
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }
        await download.image(options);
        res.json(`${id}/room/${date}.jpg`);
    } catch (err) {
        res.json({ error: err });
    }
})

router.post('/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const formData = req.body;
    try {
        const data = await Accomodation.findById(id);
        if (!data) {
            return res.status(404).json({ error: "Accomodation not found" });
        }
        data.rooms.push(formData);
        await data.save();
        res.json({ message: "Room added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

router.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
    const id = req.body.id;
    const uploadDir = path.join(__dirname, '../uploads', id);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    let uploadedFiles = [];
    try {
        for (let i = 0; i < req.files.length; i++) {
            const { path: tempPath, originalname, filename } = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path.join(uploadDir, filename + '.' + ext);
            fs.renameSync(tempPath, newPath);
            uploadedFiles.push(id + '/' + filename + '.' + ext);
        }
        res.json(...uploadedFiles);
    } catch (err) {
        res.json({ error: err });
    }
})


router.get('/accomodation', async (req, res) => {
    try {
        const data = await Accomodation.find();
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/accomodation', async (req, res) => {
    const formData = req.body;

    try {
        const accomodation = new Accomodation(formData);
        await accomodation.save();
        res.json({ message: "Accomodation added" });
    } catch (err) {
        res.status(500).json( err );
    }

})

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