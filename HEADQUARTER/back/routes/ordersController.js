const express = require('express')  //EXPRESS creates a local server
const router = express.Router()
const repositoryFcts = require('../repository');

const axios = require('axios')

const Branch1ApiUrl =  "http://localhost:3000/api/branch1/orders"

//API METHODS

//GET api/headquarter/orders
router.get(``,(req,res)=> {
    repositoryFcts.getOrders().then((orders)=>{

        //Success
        return res.status(200).json({ 
            data:orders
        }) 
    })
    .catch(err => { //Failure
        console.log(err)
        return res.status(404).json({ error: err}) //res.sendStatus(400) // bad request 
    })
})

//GET api/headquarter/orders/:id
router.get(`/:id`,(req,res)=> {
    repositoryFcts.getOrderById(req).then((order)=>{
        
        //Success
        return res.status(200).json({
            data:order
        })
    })
    .catch(err => {//Failure
        console.log(err)
        return res.status(404).json({ error: err}) //res.sendStatus(400) // bad request 
    })
})

//POST api/headquarter/orders
// router.post(`/`,(req,res)=> {
//     const  order = req.body
//     repositoryFcts.addOrder(order).then((addedOrder)=>{  // Adding the order in our local database (because added/accepted by the HQ in their db)

//         //Success when adding order in HQ db
//         return res.status(201).json({
//             data : addedOrder
//         })
//     })
//     .catch(err => { //Failure when adding order in local db
//         console.log(err)
//         return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
//     })
// })

//PUT api/headquarter/orders/:id
router.put(`/:id`,(req,res)=> {
    repositoryFcts.modifyOneOrder(req).then((modifiedOrder)=>{

        //Success
        return res.sendStatus(204) //Not content
    })
    .catch(err => {//Failure
        console.log(err)
        return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
    })
})

//DELETE api/headquarter/orders/:id
router.delete(`/:id`,(req,res)=> {
    repositoryFcts.deleteOrder(req).then((deletedOrder)=>{
        
        axios.delete(`${Branch1ApiUrl}/orderdelivered/${req.params.id}`).then(resFromBranch => { //Sending the deletedo$Order to the Branch 

            //TODO : what todo if the request (to send the deletedo$Order to the Branch) fails and the order is deleted inside local HQ db

            //Success
            return res.sendStatus(204) // No Content (status 200 if the webpage have to be refreshed after the successful request)

        })
        .catch(err => { //Failure when sending deletedOrder to branch API
            console.log(err)
            return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
        })

    })
    .catch(err => {//Failure deleting order in local HQ db
        console.log(err)
        return res.status(400).json({ error: err})// bad request  //res.sendStatus(405) for not allowed
    })
})

//POST api/headquarter/orders/queue
//RECEIVE ORDERS FROM BRANCHES
router.post(`/queue`,(req,res)=> {
    const  order = req.body
    repositoryFcts.addOrder(order).then((addedOrder)=>{  // Adding the order in our local database (because added/accepted by the HQ in their db)

        //Success when adding order in HQ db
        //CAREFUL : WE ARE RETURNING A RESPONSE TO THE BRANCH API AND NOT HQ CLIENT
        return res.status(201).json({
            data : addedOrder
        })
    })
    .catch(err => { //Failure when adding order in local db
        console.log(err)
        return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
    })
})

module.exports = router