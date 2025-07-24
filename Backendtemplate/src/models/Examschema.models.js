import mongoose from "mongoose"; 
const examSchema = new mongoose.Schema({
    examType: String,
    class: String,
    section:String,
    subject: String,
    date: Date,
    duration: String,
    status: { type: String, enum: ["Scheduled", "Completed"], default: "Scheduled" }
  });
export const Exam = mongoose.model("Exam", examSchema);