import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 // @input used for to receive data from parent, in parent child component communication
 // @output used to send data to parent from child component, @output emits events.
@Input() valuesFromHome: any;
@Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService) { }
  register()
   {
     this.authService.register(this.model).subscribe(() => {console.log('Registered Successfully!');
    }, error => {console.log(error); });
     console.log(this.model);

   }

   cancel()
   {
     this.cancelRegister.emit(false);
     console.log('canceled');
   }

  ngOnInit() {
  }

}
