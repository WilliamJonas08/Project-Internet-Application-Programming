class Order {
    constructor( id, status, origin, prodType, quantity ) {
            this.id = id;
            this.status = status;
            this.origin = origin,
            this.prodType = prodType,
            this.quantity = quantity
    }
}

module.exports = Order;