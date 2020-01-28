import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  baseUrl: String = "http://localhost:3000";
  empUrl: String = "http://localhost:3000/users";
  constructor(private http: HttpClient) { }

  login(loginData){
    console.log(loginData);
    
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }
}
