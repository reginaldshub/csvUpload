import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './_models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  public currentUserSubject: BehaviorSubject<User>;
  public nearByUsers: BehaviorSubject<any>;

  public currentUser: Observable<User>;
  baseUrl: String = "http://localhost:3000";
  userUrl: String = "http://localhost:3000/users";

  constructor(private http: HttpClient, private _router: Router, ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.nearByUsers = new BehaviorSubject<any>([]);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get nearByUsersValue(): any {
    return this.nearByUsers.value;
  }

  login(loginData) {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  register(registerData) {
    return this.http.post(`${this.baseUrl}/register`, registerData);
  }

  search(cordinatesdata) {
    return this.http.post(`${this.userUrl}/find`, {latitude: cordinatesdata.latitude, longitude:cordinatesdata.longitude});
  }

  uploadFile(data) {
    const uploadData = new FormData();
    uploadData.append('csvfile', data);
    return this.http.post(`${this.userUrl}/upload`, uploadData);
  }

  getAllUsers(){
    return this.http.get(`${this.userUrl}/getAllUsers`);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this._router.navigate(['/'])
  }
}
