import express from "express";
import cors from "cors";
import "dotenv/config";

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log("Server is Running On The Port", port);
});