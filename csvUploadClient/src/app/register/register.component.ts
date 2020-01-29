import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ServiceService } from '../service.service';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _service: ServiceService
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required],
      place: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }else{
      this._service.register(this.registerForm.getRawValue()).subscribe((res:any) => {
        if(res){
        alert(res.message);
        this.router.navigate(['/login'])
        this.submitted = false;
        }else{
          alert(res.message);
        }
      },(err) =>  alert(err.message))
    }

    this.loading = true;
  }
}