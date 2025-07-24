import mongoose, { Schema } from 'mongoose';

const AnnouncementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

export default Announcement;
