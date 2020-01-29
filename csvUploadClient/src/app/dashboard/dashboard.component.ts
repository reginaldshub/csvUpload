import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from './../_models/user';
import { ServiceService } from './../service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser;
  currentUserSubscription: Subscription;
  users: User[] = [];
  nearByUsers: any;
  searchValue: any;
  coordinateForm: FormGroup;

  constructor(
    private _service: ServiceService,
    private formBuilder: FormBuilder,
  ) {
    this.currentUserSubscription = this._service.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    // this.loadAllUsers();
    this.coordinateForm = this.formBuilder.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
    this.nearByUsers = this._service.nearByUsersValue;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  search() {
    if (this.coordinateForm.valid)
      this._service.search(this.coordinateForm.getRawValue()).subscribe((users: any) => {        
        this.nearByUsers = users.allRecords;
      })
  }
}
