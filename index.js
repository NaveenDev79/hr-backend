const express = require('express');
const dotenv = require('dotenv');
const {ConnectDB} = require('./helpers/connectDB');
const cors = require('cors');
const morgan = require('morgan'); 
const authRoute = require('./routes/authRoute'); 
const attendenceRoute = require('./routes/attendenceRoute');
const ErrorHandler = require('./middlewares/error');



//
dotenv.config({});
const app = express();

ConnectDB();
// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/attendence',attendenceRoute);
app.use(ErrorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.DEV_MODE} Mode`);
});
