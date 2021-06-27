'use strict';

const firebase = require('./db');
const firestore = firebase.firestore();

const Order = require('./orderClass')

const dbName = require('./branchApi.json')['dbName'].toString();

//REPOSITORY QUERIES

const getOrders = function(){

    return new Promise(function(resolve, reject) {

        const orders = firestore.collection(dbName)
        orders.get()
        .then(data => {
            const ordersArray = [];
            if(data.empty) {
                reject('No order record found');
            }
            else {
                data.forEach(doc => {
                    const order = new Order(
                        doc.data().id,
                        doc.data().status,
                        doc.data().origin,
                        doc.data().prodType,
                        doc.data().quantity
                    );
                    ordersArray.push(order);
                resolve(ordersArray)
                }
            )}
        })
        .catch(error => {
            console.log('Error');
            reject(error.message)
        })
    })
};

const getOrderById = function(req){

    return new Promise(function(resolve, reject) {

        const id = req.params.id;
        const order = firestore.collection(dbName).doc(id);
        order.get()
        .then(data => {
            if(data.empty) {
                reject('Order with the given ID not found');
            }
            else {
                resolve(data.data());
            }
        })
        .catch(error => {
            console.log('Error');
            reject(error.message)
        })
      })
};

const addOrder = function(req) {
    return new Promise(function(resolve, reject) {
        const data = req.body;
        const doc = firestore.collection(dbName);
        doc.orderBy('id', 'desc').limit(1).get()
        .then(lastOrder => {
            let lastId = 0;
            if (!lastOrder.empty){
                lastOrder.forEach(doc => lastId = doc.data().id)
            }
            
            const order = {
                id: lastId + 1,
                status: 'not sent',
                origin: dbName,
                prodType: data.prodType,
                quantity: data.quantity
            };
            console.log(order);
            //Hopefully it will be useless to check the object type here because i already check the order type before being sent to the HQ db
            //Managing errors
            if (!fitsOrderInterface(order).isOrder){
                reject("Order model is not correct : "+fitsOrderInterface(order).message)
            }

            //If the order in the request body has the good shape/fits the Order interfacenpm
            else { //(fitsOrderInterface(data).isOrder)
                doc.doc(order.id.toString()).set(order)
                .then(() => {
                    console.log('Record saved successfuly')
                    resolve(order)
                })
                .catch(error => {
                    console.log('Error');
                    reject(error.message)
                })
            }
        })
        .catch(error => {
            console.log('Error');
            reject(error.message)
        })
    })
};

const getSync = function(){
    return new Promise(function(resolve, reject) {
        const doc = firestore.collection(dbName);

        doc.where('status', '==', 'not sent').orderBy('id', 'desc').limit(1).get()
        .then(nonSync => {
            nonSync.forEach(toSync => {
                resolve(toSync.data())
            });
            
        })
        .catch(error => {
            console.log('Cannot connect to the Branch db');
            reject(error.message)
        })
    })
};

const syncOrder = function(id){
    return new Promise(function(resolve, reject) {

        const doc = firestore.collection(dbName);

        doc.doc(id.toString()).update({status : 'sent'})
        .then(() =>{
            console.log('Order was synchronized successfuly');

            doc.doc(id.toString()).get()
            .then(synced => {
                resolve(synced.data())
            })
            .catch(error => {
                console.log('Cannot get the synchronized object from the Branch db');
                reject(error.message)
            })
        })
        .catch(error => {
            console.log('Order cannot be updated');
            reject(error.message)
        })
    })
};


const modifyOneOrder = function(req){
    return new Promise(function(resolve, reject) {

        const id = req.params.id;
        const data = req.body;

        const order = {
            id: parseInt(id),
            status: 'locally modified',
            origin: dbName,
            prodType: data.prodType,
            quantity: data.quantity
        };
        //Managing errors
        if (!fitsOrderInterface(order).isOrder){
            console.log(fitsOrderInterface(order).message)
            reject("Order model is not correct : "+fitsOrderInterface(order).message)
        }

        //If the order in the request body has the good shape/fits the interface
        else { //(fitsOrderInterface(data).isOrder)
            firestore.collection(dbName).doc(id).update(order)
            .then(updated=>{
                console.log('Order record updated successfuly');
                resolve(order)
            })
            .catch(error => {
                console.log('Order with the given ID not found');
                reject(error.message)
            })
        }
    })
};


const deleteOrder = function(req){

    return new Promise(function(resolve, reject) {

        const id = req.params.id;

        firestore.collection(dbName).doc(id).delete()
        .then(() => {
            console.log('Successfully deleted from the DB')
            resolve(id); 
        })
        .catch(error => {
            console.log('Order with the given ID not found');
            reject(error.message)
        })
    })
};

/*
const fs = require('fs');
const readApi = function() {
    let file = '';
    fs.readFile('./branchApi.json', 'utf8', (err, API) => {
        if (err) {
            console.log('Cannot read the file with Branch API', err);
            return
        }
        try {
            file = JSON.parse(API)['versionApi'].toString();
            console.log('file', file)
        }
        catch (err){
            console.log('Cannot parse the API');
            return
        }
    })
    console.log('Here is', file);
    return file.toString()
};
*/

module.exports = {
    getOrders,
    getOrderById,
    getSync,
    addOrder,
    syncOrder,
    modifyOneOrder,
    deleteOrder,
    fitsOrderInterface,
}


//REPOSITORY ITEMS

//Each repository item is composed of named properties that store the item’s data—for example, id, firstName, and lastName.
//-> Creating functions that checks the data type before being added to the db

//This fct is also exported in the controler to check order type before being sent to the HQ
function fitsOrderInterface(obj){ // {isOrder: ItFitsInterface , message}
    //ORDER {id:number, status:string, origin:string, prodType:string, quantity:number}
    //ID
    if (!obj.id){
        return ({isOrder: false ,message:"The order doesn't have ID"})
    }
    else if (typeof (obj.id) != "number"){
        return ({isOrder: false ,message:"Order ID must be a number"})
    }
    /*//STATUS
    if (!obj.status){
        return ({isOrder: false ,message:"The order doesn't have STATUS"})
    }
    else if (typeof (obj.status) != "number"){
        return ({isOrder: false ,message:"Order STATUS must be a number"})
    }*/
    //ORIGIN
    else if (!obj.origin){
        return ({isOrder: false ,message:"The order doesn't have BRANCH ORIGIN"})
    }
    else if (typeof (obj.origin) != "string"){
        return ({isOrder: false ,message:"Order ORIGIN must be a string"})
    }
    //PROD TYPE
    else if (!obj.prodType){
        return ({isOrder: false ,message:"The order doesn't have PRODUCT TYPE"})
    }
    else if (typeof (obj.prodType) != "string"){
        return ({isOrder: false ,message:"Order PRODUCT TYPE must be a string"})
    }
    //QUANTITY
    else if (!obj.quantity){
        return ({isOrder: false ,message:"The order doesn't have QUANTITY"})
    }
    else if (typeof (obj.quantity) != "number"){
        return ({isOrder: false ,message:"Order QUANTITY must be a number"})
    }
    else {
        return ({isOrder: true ,message:"This order fits the order model"})
    }
}

//TODO
// Add id inside Order Model ? So we won't recognize and order due to it's position inside the db list but according to it's id
// CHANGE reject/resolve conditions according to db request answer
//TEST fitsOrderInterace typeof conditions