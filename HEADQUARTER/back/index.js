const express = require('express') //EXPRESS creates a local server
const app = express()
const bodyParser = require('body-parser') //BODY PARSER : To access the body of a request ( POST)

const usersRoutes = require('./routes/ordersController');
const cors = require('cors'); //Enable the access to the API for external people (or our client)


//Creating version of our api
//TODO : export in a specific file for urls
const versionApi = '/api/headquarter'  // Don't forget the first "/"


// MIDDLEWARES = functions looking for changes inside requests

app.use(bodyParser.json())// parse application/json
app.use(express.json()) //
app.use(express.urlencoded({extended:false})) //

app.use(cors());
app.use(`${versionApi}/orders`, usersRoutes);


app.listen(5000, ()=> console.log("Listening on port 5000"))