const express = require('express')  //EXPRESS creates a local server
const router = express.Router()
const repositoryFcts = require('../repository');

const axios = require('axios')

const HQApiUrl =  "http://localhost:5000/api/headquarter/orders/queue" //  + /queue  //TODO : changer n localhost

//API METHODS

//GET api/branch1/orders
router.get(``,(req,res)=> {
    repositoryFcts.getOrders().then((orders)=>{

        //Success
        return res.status(200).json({ //Be careful : res.sendStatus != res.status
            data:orders
        }) 
    })
    .catch(err => { //Failure
        console.log(err)
        return res.status(404).json({ error: err}) //res.sendStatus(400) // bad request 
    })
})

//GET api/branch1/orders/:id
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

//POST api/branch1/orders
router.post(`/`,(req,res)=> {

    const  order = req.body
    if (!repositoryFcts.fitsOrderInterface(order).isOrder){ //if order from req doesn't fit with order Model
        const err = repositoryFcts.fitsOrderInterface(order).message
        console.log(err)
        return res.status(400).json({ error: err})
    }
    else { //if order from req fits with order Model
        axios.post(`${HQApiUrl}`,order).then(resFromHQ => { //Sending the order to the HQ 

            if (resFromHQ['data'].data && JSON.stringify(resFromHQ['data'].data /*order added in HQ db*/) === JSON.stringify(order)){ // If order successfully added in the HQ db //TODO : best condition ?                repositoryFcts.addOrder(order).then((addedOrder)=>{  // Adding the order in our local database (because added/accepted by the HQ in their db)
                repositoryFcts.addOrder(order).then((addedOrder)=>{  // Adding the order in our local database (because added/accepted by the HQ in their db)    
                    //Success when adding order in local db
                    return res.status(201).json({
                        data : addedOrder
                    })
                })
                .catch(err => { //Failure when adding order in LOCAL db
                    console.log(err)
                    return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
                })

            }
            //TODO USEFUL  ??
            else { //Problem when adding order in HQ db
                //The problem should be handled by the next catch (if res = error or if order added in HQ doesn't correspond to the one going to be added in local db)
                console.log("Problem when sending the order to the HeadQuarter")
                return res.status(400).json({ error: "Problem when sending the order to the HeadQuarter"})
            }

        })
        .catch(err => { //Failure when adding order in HQ db
            console.log(err)
            return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
        })
    }
})

//PUT api/branch1/orders/:id
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

//DELETE api/branch1/orders/:id
// router.delete(`/:id`,(req,res)=> {
//     repositoryFcts.deleteOrder(req).then((deletedOrder)=>{
        
//         //Success
//         return res.sendStatus(204) // No Content (status 200 if the webpage have to be refreshed after the successful request)
//     })
//     .catch(err => {//Failure
//         console.log(err)
//         return res.status(400).json({ error: err})// bad request  //res.sendStatus(405) for not allowed
//     })
// })


//POST api/headquarter/orders/queue
//RECEIVE DELIVERY (of orders) FROM HQ (we have to delete the order from local branch db)
router.delete(`/orderdelivered/:id`,(req,res)=> {
    repositoryFcts.deleteOrder(req).then((deletedOrder)=>{
        
        //Success
        //CAREFUL : WE ARE RETURNING A RESPONSE TO THE HQ API AND NOT BRANCH CLIENT
        return res.sendStatus(204) // No Content (status 200 if the webpage have to be refreshed after the successful request)
    })
    .catch(err => {//Failure
        console.log(err)
        return res.status(400).json({ error: err})// bad request  //res.sendStatus(405) for not allowed
    })
})



// TEST REQUEST FOR HEAD QUARTERS
// router.post(`/queue`,(req,res)=> {
//     axios.post(`${HQApiUrl}`,req.body ).then(resFromHQ => {
//         console.log(JSON.stringify(resFromHQ['data'].data) === JSON.stringify(req.body) )
//         res.json({
//             data:resFromHQ['data'].data
//         })
//     })
//     .catch(error => {
//         console.error(error)
//         return res.status(400).json({ error: error})
//     })
// })


module.exports = router



//Post
//Post on HQ db and then call another http req to post the order on local db

//Delete:
//Only used after a callback from the headquarter (=when the delivery is received)
//The  HQ deletes the order in it's own db and then the order is posted in the branch db in a queue collection as an order waiting to be deleted

//Put:
// When will we use it ?


//NICE RESSOURCES
//POST req + req authorization token (inside header): https://www.youtube.com/watch?v=1cjdlfB11Ss
