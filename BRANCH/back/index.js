'use strict';
const express = require('express') //EXPRESS creates a local server
const bodyParser = require('body-parser') //BODY PARSER : To access the body of a request ( POST)

const ordersRoutes = require('./routes/ordersController');
const cors = require('cors'); //Enable the access to the API for external people (or our client)


//Creating version of our api
//TODO : export in a specific file for urls
const versionApi = require('./branchApi.json')['versionApi'].toString();
//const repofcs = require('./repository');
//const versionApi = repofcs.readApi();

//const versionApi = '/api/branch1'  // Don't forget the first "/"
console.log('Current branch: ', versionApi);


const app = express()
// MIDDLEWARES = functions looking for changes inside requests

app.use(bodyParser.json())// parse application/json
app.use(express.json()) //
app.use(cors())
app.use(express.urlencoded({extended:false})) //

app.use(`${versionApi}/orders`, ordersRoutes);


app.listen(3000, ()=> console.log("Listening on port 3000"))