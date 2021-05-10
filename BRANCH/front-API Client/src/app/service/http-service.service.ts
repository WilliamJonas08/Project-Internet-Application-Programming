import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private API_url="http://localhost:3000/api/branch1/orders"

  constructor(private http: HttpClient,) { }

  GetAllUsers(){
    return this.http.get(`${this.API_url}`)
  }

  GetOneUser(id:number){
    return this.http.get(`${this.API_url}/${id}`)
  }

  AddOneUser(user:User){
    return this.http.post(`${this.API_url}`,user)
  }

  ModifyOneUser(id:number, user:User){
    return this.http.put(`${this.API_url}/${id}`,user)
  }

  DeleteOneUser(id:number){
    return this.http.delete(`${this.API_url}/${id}`)
  }
}
