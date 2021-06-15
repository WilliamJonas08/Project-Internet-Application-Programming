import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Order} from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private API_url="http://localhost:3000/api/branch1/orders"

  constructor(private http: HttpClient,) { }

  GetAllOrders(){
    return this.http.get(`${this.API_url}`)
  }

  GetOneOrder(id_order:number){
    return this.http.get(`${this.API_url}/${id_order}`)
  }

  AddOneOrder(order:Order){
    return this.http.post(`${this.API_url}`,order)
  }

  DeleteOneOrder(id_order:number){
    return this.http.delete(`${this.API_url}/${id_order}`)
  }

  ModifyOneOrder(id_order:number, order:Order){
    return this.http.put(`${this.API_url}/${id_order}`,order)
  }
}
