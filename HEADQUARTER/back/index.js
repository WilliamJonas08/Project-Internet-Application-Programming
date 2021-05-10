const express = require('express') //EXPRESS creates a local server
const app = express()
const bodyParser = require('body-parser') //BODY PARSER : To access the body of a request ( POST)

const usersRoutes = require('./routes/usersController');
const cors = require('cors'); //Enable the access to the API for external people (or our client)

//Creating version of our api
const versionApi = '/api/v1'  // Don't forget the first "/"

// MIDDLEWARES = functions looking for changes inside requests
app.use(bodyParser.json())// parse application/json
app.use(cors());
app.use(`${versionApi}/users`, usersRoutes);

app.listen(3000, ()=> console.log("Listening on port 3000"))