import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  file: any;
  allUsersData: any = [];

  constructor(private _service: ServiceService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  onFileChanged(event) {
    this.file = event.target.files[0];
    }

upload(){
  this._service.uploadFile(this.file).subscribe((res:any)=>{
    if(res)
    alert("uploaded successfully")
    this.getAllUsers();
  })
}

getAllUsers(){
  this._service.getAllUsers().subscribe((allusers:any) => {
    this.allUsersData = allusers.allRecords;
  })
}

}
