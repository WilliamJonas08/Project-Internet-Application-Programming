//EXPRESS creates a local server
const express = require('express')
const app = express()

const cors = require('cors'); //Enable the access to the API for external people
app.use(cors());

//FAKER : npm package used to generate fake data (for your database)
const faker = require('faker')

//BODY PARSER : To access the body of a request ( POST)
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//const { userModel } = require('../models/userModel');
//DATA BASE
const  users =[]
for(let i=0;i<10;i++){
    users.push({
        firstname:faker.name.firstName(),
        surname:faker.name.lastName(),
        mail:faker.internet.email()
    })
}
//console.log(users)

//Creating version of our api
const versionApi = '/api/v1'  // Don't forget the first "/"


//API METHODS
//GET /users
app.get(`${versionApi}/users`,(req,res)=> {
    res.json({
        data:users
    })
})

//GET api/v1/users/:id
app.get(`${versionApi}/users/:id`,(req,res)=> {
    let id = req.params.id -1

    res.json({
        data:users[id]
    })
})

//POST api/v1/users
app.post(`${versionApi}/users`,(req,res)=> {
    const data = req.body
    
    //Normalement il faut verifier si les données sont correctes
    users.push(data)

    res.json({
        index:users.length,
        data:users[users.length-1]
    })
})

//PUT api/v1/users/:id
app.put(`${versionApi}/users/:id`,(req,res)=> {
    let id = req.params.id -1
    const data = req.body

    //Object.assign enable to merge the 2 variables
    users[id]= Object.assign(users[id],data)

    res.json({
        data:users[id]
    })
})

//DELETE api/v1/users/:id
app.delete(`${versionApi}/users/:id`,(req,res)=> {
    let id = req.params.id -1

    //Object.assign enable to merge the 2 variables
    users.splice(id,1)
    //console.log(users.length)
    
    res.json({
        data:"User successfuly deleted"
    })
    res.sendStatus(200)
})

app.listen(3000, ()=> console.log("Listening on port 3000"))