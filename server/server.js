const express = require('express');
const cors=require("cors");
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
const app = express();

require('dotenv').config();

app.use(cors(corsOptions));

// Add a middleware to set the Access-Control-Allow-Origin header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/spotify.routes')(app);

app.listen(8000, () => {console.log(`listening on port: 8000`)});

