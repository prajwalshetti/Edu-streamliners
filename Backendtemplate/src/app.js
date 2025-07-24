import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"

dotenv.config({
    path: "../.env"
});

const app = express()


const CLIENT_URL = process.env.CLIENT_URL;
console.log(CLIENT_URL);
const normalizedClientUrl = CLIENT_URL.replace(/\/$/, '');

console.log(CLIENT_URL);
app.use(cors({
    origin: [
        normalizedClientUrl,
        `${normalizedClientUrl}/`
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version']
}));
//common middlewares
app.use(express.json({ limit: "1000kb" }))
app.use(express.urlencoded({ extended: true, limit: "1000kb" }))
app.use(express.static("public"))
app.use(cookieParser());


import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"
import studentRouter from "./routes/student.routes.js"
import teacherRouter from "./routes/teacher.routes.js"
import timetableRouter from "./routes/timetable.routes.js"
import SubjectRouter from "./routes/subject.routes.js"
import ExamRouter from "./routes/exam.routes.js"
import LessonPlanRouter from "./routes/lessonPlan.routes.js"
import smsRouter from "./routes/sms.routers.js"
import verifyLoginRouter from "./routes/verifyLogin.routes.js"

import Announcerouter from "./routes/announce.routes.js"
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Working fine"
    })
})
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/timetable", timetableRouter);
app.use("/api/v1/subjects", SubjectRouter);
app.use("/api/v1/exams", ExamRouter);
app.use("/api/v1/lessonPlans", LessonPlanRouter);
app.use("/api/v1/sms", smsRouter); 
app.use("/api/v1/verify", verifyLoginRouter); 

app.use("/api/v1/sms", smsRouter);
app.use("/api/v1/announcements", Announcerouter);

export { app }