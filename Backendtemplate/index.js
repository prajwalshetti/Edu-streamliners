import { app } from "./src/app.js";
import dotenv from "dotenv"
dotenv.config();  // No need for a custom path

const PORT = process.env.PORT
    // app.listen(PORT, () => {
    //         console.log(`Server is running on port ${PORT}`)
    //     })

import connectionDB from "./src/db/index.js"
connectionDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port${PORT}`)
        })
    })
    .catch((err) => {
        console.log("mongodb connection error");
    })