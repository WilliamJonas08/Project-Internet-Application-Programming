import { Component } from '@angular/core';
import { HttpService } from './service/http-service.service';

export class User {
  firstname:string
  surname:string
  mail:string
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
  public Show_GetOneUser_Form:boolean=false
  public Show_AddOneUser_Form:boolean=false
  public Show_ModifyOneUser_Form:boolean=false
  public Show_DeleteOneUser_Form:boolean=false

  //id of the user to get/modify/delete
  public id:number
  //Data to add a new user
  public firstname:string
  public surname:string
  public mail:string

  public displayedData:Array<User>

  ShowForm(index:number){
    this.Show_GetOneUser_Form=false
    this.Show_AddOneUser_Form=false
    this.Show_ModifyOneUser_Form=false
    this.Show_DeleteOneUser_Form=false
    if (index===1){this.Show_GetOneUser_Form=true}
    if (index===2){this.Show_AddOneUser_Form=true}
    if (index===3){this.Show_ModifyOneUser_Form=true}
    if (index===4){this.Show_DeleteOneUser_Form=true}
  }


  GetAllUsers(){
    this.service.GetAllUsers().subscribe((data)=>{
      this.displayedData =data['data']
      console.log(data['data'])
    })
  }

  GetOneUser(id:number){
    this.service.GetOneUser(id).subscribe((data)=>{
      this.displayedData = [data['data']] //I put the single object in a Array of 1 element
    })
  }

  AddOneUser(firstname:string,surname:string,mail:string){
    const user={firstname,surname,mail}
    this.service.AddOneUser(user).subscribe((data)=>{
      this.displayedData = [data['data']] 
    })
  }

  ModifyOneUser(id:number, firstname:string,surname:string,mail:string){
    const user={firstname,surname,mail}
    this.service.ModifyOneUser(id, user).subscribe((data)=>{
      this.displayedData = [data['data']] 
    })
  }

  DeleteOneUser(id:number){
    this.service.DeleteOneUser(id).subscribe((data:{data:string})=>{
      const message:string=data['data']
      const emptyMsg:string = ""
      const emptyMsg2:string = ""
      this.displayedData = [{firstname: message, surname:emptyMsg, mail:emptyMsg2}]
    })
  }
  
}
