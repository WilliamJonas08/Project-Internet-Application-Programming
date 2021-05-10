const express = require('express')  //EXPRESS creates a local server
const router = express.Router()
const repositoryFcts = require('../repository');
const http =  require ("http")

const HQApiUrl =  "http://localhost:3000/api/hq/queue"  //TODO : changer n localhost

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

    //TODO : tests avant envoit en HQ
    const  order = req.body
    if (!repositoryFcts.fitsOrderInterface(order).isOrder){ //if order from req doesn't fit with order Model
        const err = repositoryFcts.fitsOrderInterface(order).message
        console.log(err)
        return res.status(400).json({ error: err})
    }
    else { //if order from req fits with order Model
        //http.post(`${HQApiUrl}`,order).subscribe((resFromHQ)=>{ //Sending the order to the HQ 
            if (true){ // resFromHQ && resFromHQ ===order If order successfully added in the HQ db
                repositoryFcts.addOrder(order).then((addedOrder)=>{  // Adding the order in our local database (because added/accepted by the HQ in their db)

                    //Success when adding order in local db
                    return res.status(201).json({
                        data : addedOrder
                    })
                })
                .catch(err => { //Failure when adding order in local db
                    console.log(err)
                    return res.status(400).json({ error: err}) // bad request  //res.sendStatus(405) for not allowed
                })
            }
            else { //Problem when adding order in HQ db
                //TODO : voir si autre manière de catcher l'erreur directement de la réponse de l'API HQ
                console.log("Problem when sending the order to the HeadQuarter")
                return res.status(400).json({ error: "Problem when sending the order to the HeadQuarter"})
            }
        //})
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
router.delete(`/:id`,(req,res)=> {
    repositoryFcts.deleteOrder(req).then((deletedOrder)=>{
        
        //Success
        return res.sendStatus(204) // No Content (status 200 if the webpage have to be refreshed after the successful request)
    })
    .catch(err => {//Failure
        console.log(err)
        return res.status(400).json({ error: err})// bad request  //res.sendStatus(405) for not allowed
    })
})


// //REQUEST FOR HEAD QUARTERS
// //do we have to send 

// //POST api/branch1/toheadquarter
// router.post(`/`,(req,res)=> {
//     repositoryFcts.deleteOrder(req).then((order)=>{
        
//         //Success
//         //res.sendStatus(204) // No Content (status 200 if the webpage have to be refreshed after the successful request)
//         return res.status(204).json({
//             data:order
//         })
//     })
//     .catch(err => {//Failure
//         console.log(err)
//         return res.status(400).json({ error: err})// bad request 
//         //res.sendStatus(405) for not allowed
//     })
// })

module.exports = router


//TODO
//http request to HQ + Local post method inside it's callback
//que  doivent retourner des requetes POST et DELETE ? changer ces méthodes plus le retour du HQ aux branches



//Advices branch side

//Post
//Post on HQ db and then call another http req to post the order on local db

//Delete:
//Only used after a callback from the headquarter (=when the delivery is received)

//Put:
// When will we use it 


//NICE RESSOURCES
//POST req + req authorization token (inside header): https://www.youtube.com/watch?v=1cjdlfB11Ss

//{
//     "id":10,
//     status:1,
//     origin : postman,
//     prodType : "chair",
//     quantity : 8,
// }