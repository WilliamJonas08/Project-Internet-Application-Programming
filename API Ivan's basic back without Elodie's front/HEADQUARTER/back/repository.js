'use strict';

const faker = require('faker'); //FAKER : npm package used to generate fake data (for your database)

//FAKE DATA BASE

//ORDER {id, status, origin, prodType, quantity} + date ?
let  orders =[] //empty at the beginning
// productType=["chair","table","pillow"]//TODO import productsTypes array from Firebase
// minProductIndex = 0
// maxProductIndex=2
// minQuantity= 1
// maxQuantity=100
// for(let i=0;i<1;i++){
//     orders.push({
//         id: i,
//         status:1, // status depending of the state of the order
//         origin:"branch1",
//         productType:productType[Math.floor(Math.random() * (maxProductIndex - minProductIndex + 1)) + minProductIndex],
//         quantity:Math.floor(Math.random() * (maxQuantity - minQuantity + 1)) + minQuantity,
//     })
// }

const firebase = require('./db');
const firestore = firebase.firestore();

const Order = require('./orderClass')

//REPOSITORY QUERIES

const getOrders = function(){

    return new Promise(function(resolve, reject) {

        const orders = firestore.collection('orders_hq_storage')
        orders.get()
        .then(data => {
            const ordersArray = [];
            if(data.empty) {
                reject('No order record found');
            }
            else {
                data.forEach(doc => {
                    const order = new Order(
                        doc.id,
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
        const order = firestore.collection('orders_hq_storage').doc(id);
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

const addOrder = function(req){
    return new Promise(function(resolve, reject) {

        const data = req.body;
        //Hopefully it will be useless to check the object type here because i already check the order type before being sent to the HQ db
        //Managing errors
        if (!fitsOrderInterface(data).isOrder){
            reject("Order model is not correct : "+fitsOrderInterface(data).message)
        }

        //If the order in the request body has the good shape/fits the Order interface
        else { //(fitsOrderInterface(data).isOrder)
            const toStor = firestore.collection('orders_hq_storage').doc(data.id.toString()).set(data)
            const toProc = firestore.collection('orders_hq_processing').doc(data.id.toString()).set(data)
            Promise.all([
                toStor,
                toProc
            ])
            .then(() => {
                console.log('Record saved successfuly')
                resolve(data)
            })
            .catch(error => {
                console.log('Error');
                reject(error.message)
            })
        }
      })
};


const modifyOneOrder = function(req){
    return new Promise(function(resolve, reject) {

        const id = req.params.id;
        firestore.collection('orders_hq_storage').doc(id)
        .then(order => {
            if(!order) {
                reject('Order with the given ID not found');
            }
            else {
                const data = req.body;

                //Managing errors
                if (!fitsOrderInterface(data).isOrder){
                    reject("Order model is not correct : "+fitsOrderInterface(data).message)
                }

                //If the order in the request body has the good shape/fits the interface
                else { //(fitsOrderInterface(data).isOrder)
                    order.update(data)
                    .then(updated=>{
                        console.log('Order record updated successfuly');
                        resolve(updated.data())
                    })
                }
            }
        })
        .catch(error => {
            console.log('Error');
            reject(error.message)
        })
    })
};

//Deleting order from the Production list + Adding it in the general db
const deleteOrder = function(req){

    return new Promise(function(resolve, reject) {

        const id = req.params.id;

        const fromStor = firestore.collection('orders_hq_storage').doc(id).delete();
        const fromProc = firestore.collection('orders_hq_processing').doc(id).delete();
        Promise.all([
            fromStor,
            fromProc
        ])
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

module.exports = {
    getOrders,
    getOrderById,
    addOrder,
    modifyOneOrder,
    deleteOrder,
    fitsOrderInterface
}


//REPOSITORY ITEMS

//Each repository item is composed of named properties that store the item’s data—for example, id, firstName, and lastName.
//-> Creating functions that checks the data type before being added to the db

//This fct is also exported in the controler to check order type before being sent to the HQ
function fitsOrderInterface(obj){ // {isOrder: ItFitsInterface , message}
    //ORDER {id:number, status:number, origin:string, prodType:string, quantity:number}
    //ID
    if (!obj.id){
        return ({isOrder: false ,message:"The order doesn't have ID"})
    }
    else if (typeof (obj.id) != "number"){
        return ({isOrder: false ,message:"Order ID must be a number"})
    }
    //STATUS
    if (!obj.status){
        return ({isOrder: false ,message:"The order doesn't have STATUS"})
    }
    else if (typeof (obj.status) != "number"){
        return ({isOrder: false ,message:"Order STATUS must be a number"})
    }
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
// CHANGE reject/resolve conditions according to db request answer