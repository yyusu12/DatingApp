import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { Router } from '@angular/router';

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
 user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private route: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.minLength(4), Validators.maxLength(8), Validators.required]),
    //   confirmedPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator);
  }

  // creating form using FormBuilder
  createRegisterForm(){
    this.registerForm = this.fb.group({
      gender: ['male', Validators.required],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmedPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }
 // password match function
  passwordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmedPassword').value ? null : {'mismatch': true};
  }
  register()
   {
     if (this.registerForm.valid)
     {
       // passing the values of the registerForm into the model User
       // registerForm Values to the {} => user
       // log users in after registration
       this.user = Object.assign({}, this.registerForm.value);
       this.authService.register(this.user).subscribe(() => {this.alertify.success('Registered successfully'); },
       error => {this.alertify.error(error); this.registerForm.reset(); }, () => {this.authService.login(this.user).subscribe
      (() => {this.route.navigate(['/members']); });

    });
     }

     console.log(this.registerForm.value);

   }

   cancel()
   {
     this.cancelRegister.emit(false);
     this.alertify.message('canceled');
   }
}
