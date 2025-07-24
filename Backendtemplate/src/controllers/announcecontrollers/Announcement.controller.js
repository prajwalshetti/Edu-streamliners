import Announcement from "../../models/Announcement.models.js";

// Create a new announcement
export const createAnnouncement= async (req, res) => {
    try {
        const announcements = req.body; // Expecting an array of announcement objects
        if (!Array.isArray(announcements) || announcements.length === 0) {
            return res.status(400).json({ error: "Invalid data format. Expecting a non-empty array." });
        }

        const newAnnouncements = await Announcement.insertMany(announcements);
        res.status(201).json(newAnnouncements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all announcements
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt:1});

        if (!announcements || announcements.length === 0) {
            return res.status(404).json({ message: "No announcements found." });
        }

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
