const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const routesHandler = require('./router/handler.js')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);

app.listen(PORT, () => {
    console.log('server is running on port ' + PORT + ".");
});