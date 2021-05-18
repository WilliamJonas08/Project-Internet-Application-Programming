const faker = require('faker'); //FAKER : npm package used to generate fake data (for your database)

//FAKE DATA BASE

//ORDER {id, status, origin, prodType, quantity} + date ?
let  orders =[]
productType=["chair","table","pillow"]//TODO import productsTypes array from Firebase
minProductIndex = 0
maxProductIndex=2
minQuantity= 1
maxQuantity=100
for(let i=0;i<10;i++){
    orders.push({
        id: i,
        status:1, // status depending of the state of the order
        origin:"branch1",
        productType:productType[Math.floor(Math.random() * (maxProductIndex - minProductIndex + 1)) + minProductIndex],
        quantity:Math.floor(Math.random() * (maxQuantity - minQuantity + 1)) + minQuantity,
    })
}


//REPOSITORY QUERIES

const getOrders = function(){

    return new Promise(function(resolve, reject) {

        //REQUEST orders in db
        //////////////////////
        // INSERT DB REQUEST /
        //////////////////////

        if (!orders.length){ //TODO  :  good if condition ?
            reject("Orders not found !");
        }

        else {  // (orders.length)
            resolve(orders);
        }
      })
};
    
const getOrderById = function(req){
    let id = req.params.id //not -1
    return new Promise(function(resolve, reject) {

        //REQUEST order in db
        //////////////////////
        // INSERT DB REQUEST /
        //////////////////////

        const order = orders.find(order => order.id== id)

        if (!order){
            reject(`Order n°${id} not found`); //not +1
        }

        else {  //(order)
            resolve(order);
        }
      })
};

const addOrder = function(order){
    //const order = req.body
    return new Promise(function(resolve, reject) {

        //Hopefully it will be useless to check the object type here because i already check the order type before being sent to the HQ db
        //Managing errors
        if (!fitsOrderInterface(order).isOrder){
            reject("Order model is not correct : "+fitsOrderInterface(order).message)
        }

        //If the order in the request body has the good shape/fits the Order interface
        else { //(fitsOrderInterface(order).isOrder)

            //POST order in db
            //////////////////////
            // INSERT DB REQUEST /
            //////////////////////
            orders.push(order)

            //TODO : add conditions
            // if (order.length){
                resolve(order); // We choose to return the addedOrder as a response body
            // }

        }
      })
}

const modifyOneOrder = function(req){
    const id = req.params.id //not -1
    const order = req.body
    return new Promise(function(resolve, reject) {

        //Managing errors
        if (!fitsOrderInterface(order).isOrder){
            reject("Order model is not correct : "+fitsOrderInterface(order).message)
        }

        //If the order in the request body has the good shape/fits the interface
        else { //(fitsOrderInterface(order).isOrder)

            //PUT order in db
            //////////////////////
            // INSERT DB REQUEST /
            //////////////////////
            //TODO : alternatives for local db
            let orderToUpdate = orders.find(order => order.id== id)
            orderToUpdate= Object.assign(orderToUpdate,order)  //Object.assign enable to merge the 2 variables

            //TODO : verify if the id is between 0 and orders.length

            // if order with this id does not exist
                //reject("Order id is not correct ")

            // if (order.length){
                resolve(orders[id]);  // We choose to return the modifiedOrder ( available in the controller but not in the response body)
            // }
        }
      })
}

const deleteOrder = function(req){
    let id = req.params.id //not -1
    return new Promise(function(resolve, reject) {

        //DELETE order in db
        //////////////////////
        // INSERT DB REQUEST /
        //////////////////////
        //TODO : alternatives for local db
        orderToDelete = orders.find(order => order.id == id)
        

        if (!orderToDelete){
            reject(`Order n°${id} not found`); //not +1
        }

        else { 
            orders.splice(orders.indexOf(orderToDelete), 1);
            resolve( orderToDelete );  // We choose to return the deletedOrder ( available in the controller but not in the response body)
        }
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
    else if (!obj.productType){
        return ({isOrder: false ,message:"The order doesn't have PRODUCT TYPE"})
    }
    else if (typeof (obj.productType) != "string"){
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