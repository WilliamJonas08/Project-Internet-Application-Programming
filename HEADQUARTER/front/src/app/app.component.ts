import { Component } from '@angular/core';
import { HttpService } from './service/http-service.service';

export class Order {
  id : number
  productType: string
  quantity: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-api-client';
  constructor(private service:HttpService){}

  //Variables to display a specific form according to the request that have been made

  public Show_GetOneOrder_Form:boolean=false
  public Show_AddOneOrder_Form:boolean=false
  public Show_DeleteOneOrder_Form:boolean=false
  public Show_ModifyOneOrder_Form:boolean=false

  //id and quantity of the order to get/modify/delete

  public id_order: number
  public quantity: number

    //product of the order to get/modify/delete
    
    public product_type: string

  public displayedData:Array<Order>

  ShowForm(index:number){
  
    this.Show_DeleteOneOrder_Form=false
    this.Show_GetOneOrder_Form=false
    this.Show_AddOneOrder_Form=false
    this.Show_ModifyOneOrder_Form=false

    if (index ==5){this.Show_GetOneOrder_Form=true}
    if (index ==6){this.Show_AddOneOrder_Form=true}
    if (index ==7){this.Show_DeleteOneOrder_Form=true}
    if (index ==8){this.Show_ModifyOneOrder_Form=true
    }
  }


  GetAllOrders(){
    this.service.GetAllOrders().subscribe((data)=>{
      this.displayedData =data['data']
      console.log(data['data'])
    })
  }

  GetOneOrder(id_order:number){
    this.service.GetOneOrder(id_order).subscribe((data) => {
      this.displayedData = [data['data']]
    })
  }

  //NOT AVAILABLE IN HQ
  AddOneOrder(product_type:string,quantity:number){
    const order : Order={id: 0, productType: product_type, quantity}
    this.service.AddOneOrder(order).subscribe((data)=>{
     //Not sending back data from api
     //this.displayedData = [data['data']] 
    })
  }

  DeleteOneOrder(id_order:number){
    this.service.DeleteOneOrder(id_order).subscribe((data:{data:string})=>{
      //Not sending back data from api
      //const message:string=data['data']
      //const noquantity:number= 0
    //  this.displayedData = [{product_type: message, quantity:noquantity}]
    })
  }
 
  //NOT AVAILABLE IN HQ
  ModifyOneOrder(id_order:number, product_type:string,quantity:number){
    const order : Order ={id: 0, productType: product_type,quantity}
    this.service.ModifyOneOrder(id_order, order).subscribe((data)=>{
      //Not sending back data from api
      //this.displayedData = [data['data']] 
    })
  }

}
