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
        console.log("Failure when trying to get all orders from local Branch db")
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
        console.log("Failure when trying to get a specific order from local Branch db")
        console.log(err)
        return res.status(404).json({ error: err}) //res.sendStatus(400) // bad request 
    })
})

//POST api/branch1/orders
router.post(`/`,(req,res)=> {
    const  order = req.body
    repositoryFcts.addOrder(order).then((addedOrder)=>{  // Adding the order in our local database   
        
        //Success when adding order in LOCAL branch db
        axios.post(`${HQApiUrl}`,order).then(resFromHQ => { //Send the order to HQ
            
            return res.status(201).json({
                data : resFromHQ //TODO = addedOrder ?
            })
        })
        .catch(err => { //Failure when adding/sending order in HQ db
            console.log("Failure when sending the order to the HeadQuarter db")
            console.log(err)
    
            //////////////////////////////////////////////////////
            // MANAGE THE ERROR WITH FAILURE TO CONNECT WITH HQ // -> SYNCHRONISATION PROCESS
            //////////////////////////////////////////////////////
    
            return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
        })
    })
    .catch(err => { //Failure when adding order in LOCAL branch db
        console.log("Failure when adding order in local Branch db")
        console.log(err)
        return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
    })

})

//Won't be used by HQ client
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

//DELETE api/branch1/orders/orderdelivered/
//RECEIVE DELIVERY (of orders) FROM HQ (we have to delete the order from local branch db)
router.delete(`/orderdelivered/:id`,(req,res)=> {
    repositoryFcts.deleteOrder(req).then((deletedOrder)=>{
        
        //Success
        //CAREFUL : WE ARE RETURNING A RESPONSE TO THE HQ API AND NOT BRANCH CLIENT
        return res.sendStatus(204) // No Content (status 200 if the webpage have to be refreshed after the successful request)
    })
    .catch(err => {//Failure
        console.log("Failure deleting order in local Branch db")
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


//NICE RESSOURCES
//POST req + req authorization token (inside header): https://www.youtube.com/watch?v=1cjdlfB11Ss
