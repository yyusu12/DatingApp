import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  values: any;
  constructor(private http: HttpClient) { }
  // used to call functions on initiation
  ngOnInit() {
    //this.getValues();
  }
  // toggle between home and registration
  registerToggle()
  {
    this.registerMode = true;
  }

  // getValues()
  // {
  //   this.http.get('http://localhost:5000/api/values').subscribe(response => {this.values = response; },
  //   error => {
  //    console.log(error);
  //   }
  //   );
  // }
// going back to home after canceling the registration
  cancelRegisterMode(registerMode: boolean)
  {
    this.registerMode = registerMode;

  }

}
