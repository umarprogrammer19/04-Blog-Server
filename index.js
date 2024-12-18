import express from "express"
const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.send('Hello server')
})

app.listen(port, () => {
    console.log("SERVER IS RUNNING AT PORT", port);
})