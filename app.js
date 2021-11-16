const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var config = require('config');
var morgan = require('morgan')

//Connecting To Db
require('./handler/database');

//Initializing the app
const app = express();
//Defining the Port
const PORT = config.get('App.PORT') || 5000;


//Defining the MiddleWares
app.use(cors());

// BodyParser Middleware
app.use(bodyParser.json());

//Implementing cors
app.use((res, req, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.statusCode(200).json({});
    }
    next();
});

app.use(morgan("combined"));

//Bringing in the Routes
app.use('/api', require('./routes'));

//Initializing the server
app.listen(PORT, () => {
    console.log('Server started on PORT ' + PORT);
    console.log(config.get('App.SECRET_CODE'));
})