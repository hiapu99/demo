const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes/Router');
const DataBase = require('./config/DataBase');
dotenv.config();
DataBase()
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router)

app.listen(PORT, () => {
    console.log(`This server is running ${PORT}`)
})