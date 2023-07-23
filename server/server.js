const express = require('express');
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');


require('dotenv').config();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/spotify.routes')(app);

app.listen(8000, () => {console.log(`listening on port: 8000`)});

