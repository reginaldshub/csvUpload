import { Component } from '@angular/core';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'csvUploadClient';
  currentUser;

  constructor(private _service: ServiceService){
    this._service.currentUser.subscribe(x => this.currentUser = x);
  }
  logout(){
    this._service.logout();
  }
}
