import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
const app = express();
const port = 8000;
import cookieParser from "cookie-parser";
import cors from "cors";
import connectdb from './src/db/index.js';
import userRouter from "./src/routes/user.routes.js";
import blogRouter from "./src/routes/blog.routes.js";
import reactionRouter from "./src/routes/reaction.routes.js";

const corsOption = {
    origin: '',
    Credentials: true
};
app.use(cors(corsOption));
app.use((urlencoded({ extended: false })));
app.use(express.json());
app.use(cookieParser());
app.use('/user', userRouter);
app.use('/api/v1', blogRouter);
app.use('/api/v2', reactionRouter);


app.get('/', (req, res) => {
    res.send('Hello Talha')
});

// Connection  
connectdb()
    .then(() => {
        app.listen(port, () => {
            console.log("SERVER IS RUNNIG AT PORT", port);
        })
    })
    .catch((err) => {
        console.log(err);
    })