const { Router } = require("express");
const mongoose = require("mongoose");

const Wishlist = require("../models/Wishlist.js");

const router = Router();

router.get("/:id", async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "User ID is required", error: true, wishlist: [] });
    }

    try {
        const wishlist = await Wishlist.find({ userId: id }).populate("hotelId");
        res.json({message: "Wishlist fetched successfully", error: false, wishlist});
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Internal server error", error: true, wishlist: [] });
    }
});


router.post("/", async (req, res) => {
    const { userId, hotelId, hotelName, location, price } = req.body;

    if (!userId || !hotelId || !hotelName || !location || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const wishlistItem = new Wishlist({
            userId: mongoose.Types.ObjectId(userId),
            hotelId: mongoose.Types.ObjectId(hotelId),
            hotelName,
            location,
            price,
        });

        await wishlistItem.save();
        res.json({ message: "Wishlist item added successfully", error: false });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Internal server error", error: true });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Wishlist item ID is required" });
    }

    try {
        const result = await Wishlist.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Wishlist item not found", error: true });
        }
        res.json({ message: "Wishlist item removed successfully", error: false });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: "Internal server error", error: true });
    }
});

module.exports = router;