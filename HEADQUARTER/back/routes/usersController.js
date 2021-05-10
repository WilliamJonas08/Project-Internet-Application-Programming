const express = require('express')  //EXPRESS creates a local server
const router = express.Router()
//const { userModel } = require('../models/userModel');
//import {userModel} from '../models/userModel'


//FAKER : npm package used to generate fake data (for your database)
const faker = require('faker')
//DATA BASE
//:userModel[]
const  users =[]
for(let i=0;i<10;i++){
    users.push({
        firstname:faker.name.firstName(),
        surname:faker.name.lastName(),
        mail:faker.internet.email()
    })
}


//API METHODS
//GET api/v1/users
router.get(``,(req,res)=> {
    res.json({
        data:users
    })
})

//GET api/v1/users/:id
router.get(`/:id`,(req,res)=> {
    let id = req.params.id -1

    res.json({
        data:users[id]
    })
})

//POST api/v1/users
router.post(`/`,(req,res)=> {
    const data = req.body // Be carefull with the encoding strategy
    
    //Normalement il faut verifier si les données sont correctes
    //if (typeof data !== typeof userModel) {
        //return res.sendStatus(400)
    //}

    users.push(data)

    res.json({
        index:users.length,
        data:users[users.length-1]
    })

})

//PUT api/v1/users/:id
router.put(`/:id`,(req,res)=> {
    let id = req.params.id -1
    const data = req.body

    //Object.assign enable to merge the 2 variables
    users[id]= Object.assign(users[id],data)

    res.json({
        data:users[id]
    })
})

//DELETE api/v1/users/:id
router.delete(`/:id`,(req,res)=> {
    let id = req.params.id -1

    //Object.assign enable to merge the 2 variables
    users.splice(id,1)
    
    res.sendStatus(200)
})

module.exports = router