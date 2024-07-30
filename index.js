const express = require('express');
const dotenv = require('dotenv');
const {ConnectDB} = require('./helpers/connectDB');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
//
dotenv.config({});
const app = express();

ConnectDB();
// Middlewares
app.use(express.json());
app.use(cors());
app.use('/api/v1/auth',authRoute);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(500)
        .send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.DEV_MODE} Mode`);
});
