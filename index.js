const express = require('express');
require('dotenv').config({});
const {ConnectDB} = require('./helpers/connectDB');
const cors = require('cors');
const morgan = require('morgan'); 
const routes = require('./routes/routes');  
const ErrorHandler = require('./middlewares/error');


 
const app = express();

ConnectDB();
// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/',require('./routes/routes')); 
app.use(ErrorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.DEV_MODE} Mode`);
});
