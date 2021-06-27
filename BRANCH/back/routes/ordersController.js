'use strict';

const express = require('express')  //EXPRESS creates a local server
const router = express.Router()
const repositoryFcts = require('../repository');

const axios = require('axios');
const { start } = require('repl');

const HQApiUrl =  "http://localhost:5000/api/headquarter/orders/queue" //  + /queue  //TODO : changer n localhost

//API METHODS

//GET api/branch1/orders
router.get(``, (req, res)=> {

    autoSync();

    repositoryFcts.getOrders()
    .then((ordersArray)=>{
        
        //Success
        return res.status(200).json({ //Be careful : res.sendStatus != res.status
            data:ordersArray
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

    autoSync();

    repositoryFcts.getOrderById(req)
    .then((order)=>{
        
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

    autoSync();

    repositoryFcts.addOrder(req)
    .then(order => {  // Adding the order in our local database   
        //Success when adding order in LOCAL branch db
        axios.post(`${HQApiUrl}`, order)
        .then(resFromHQ => { //Send the order to HQ 

            repositoryFcts.syncOrder(order.id)
            .then(synced => {
                console.log(`Order # ${order.id} was updated`);
                console.log(synced)
                return res.status(201).json({
                    data : synced
                })
            })
            .catch(err => {
                console.log("Failure when getting unsynchronized orders from Branch db")
                return res.status
            })    
        })
        .catch(err => { //Failure when adding/sending order in HQ db
            console.log("Failure when sending the order to the HeadQuarter db")
            return res.status(400).json({ error: 'Failure when sending the order to the HeadQuarter db'}) // bad request  //res.sendStatus(405) for not allowed
        })
    })
    .catch(err => { //Failure when adding/sending order in HQ db
        console.log("Failure when adding the order to the Branch db")
        return res.status(400).json({ error: 'Failure when adding the order to the Branch db'}) // bad request  //res.sendStatus(405) for not allowed
    })
});

//Won't be used by HQ client
//PUT api/branch1/orders/:id
router.put(`/:id`,(req,res)=> {

    autoSync();

    repositoryFcts.modifyOneOrder(req)
    .then((modifiedOrder)=>{
        //Success
        console.log('modified one', modifiedOrder);
        return res.sendStatus(204)
        //return res.status(201).json({
        //    data : modifiedOrder
        //}) //Not content
    })
    .catch(err => {//Failure
        console.log('Cannot modify the order')
        return res.status(400).json({ error: 'Cannot modify the order'}) // bad request  //res.sendStatus(405) for not allowed
    })
})


//DELETE api/branch1/orders/orderdelivered/
//RECEIVE DELIVERY (of orders) FROM HQ (we have to delete the order from local branch db)
router.delete(`/orderdelivered/:id`,(req,res)=> {

    autoSync();

    repositoryFcts.deleteOrder(req)
    .then((deletedOrder)=>{
        //Success
        //CAREFUL : WE ARE RETURNING A RESPONSE TO THE HQ API AND NOT BRANCH CLIENT
        return res.sendStatus(204) // No Content (status 200 if the webpage have to be refreshed after the successful request)
    })
    .catch(err => {//Failure
        console.log("Failure deleting order in local Branch db")
        return res.status(400).json({ error: 'Failure deleting order in local Branch db'})// bad request  //res.sendStatus(405) for not allowed
    })
});

router.delete(`/:id`,(req,res)=> {
    console.log("You do not have permission to delete the order")
    return res.status(400).json({ error: 'You do not have permission to delete the order'}) // bad request  //res.sendStatus(405) for not allowed
});


let syncTimer;
let timeReboot;
let isTimerActive = false;

const autoSync = function(){
    if (syncTimer){
        console.log('SyncTimer', syncTimer)
        clearInterval(syncTimer)
    }
    syncTimer = setInterval(() => {
        console.log('AutoSync general timer')
        if (!isTimerActive) {
            startSync()
        }
    }, 1000*10);
};

const startSync = function(){

    console.log('StartSync Started', isTimerActive)
    
    if (isTimerActive) {
        clearTimeout(timeReboot)
    }
    repositoryFcts.getSync()
    .then(toSync => {
        if (Object.keys(toSync).length !== 0) {
            console.log(toSync);
            axios.post(`${HQApiUrl}`, toSync)
            .then(resFromHQ => { //Send the order to HQ
                const syncOr = resFromHQ.data.data;

                repositoryFcts.syncOrder(syncOr.id)
                .then(synced => {
                    console.log(`Order # ${synced.id} was updated`);
                    startSync()
                }) 
                .catch(err => {
                    console.log(`Order # ${syncOr.id} was synchronized but its status cannot be updated in the Branch db`)
                    isTimerActive = true;
                    timeReboot = setTimeout(() => {
                        console.log('Resync');
                        repositoryFcts.syncOrder(syncOr.id)
                    }, 1000*7)
                })
            })
            .catch(err => {
                console.log("Failure when sending the order to the HeadQuarter db")
                isTimerActive = true;
                timeReboot = setTimeout(() => {
                    console.log('Resync');
                    startSync()
                }, 1000*7)
            })
        }
        else {
            isTimerActive = false;
            console.log('All data are synchronized');
        };
    })
    .catch(err => {
        console.log("Failure when getting unsynchronized orders from Branch db")
        isTimerActive = true;
        timeReboot = setTimeout(() => {
            console.log('Resync');
            startSync()
        }, 1000*7)
    }) 
};


module.exports = router

