import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor( public authService: AuthService ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'company' : new FormControl('', [Validators.required]),
      'email' : new FormControl('', [Validators.required, Validators.email]),
      'password' : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      'confirm' : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    });
    this.registerForm.setValidators(passwordMatchValidator);
    this.registerForm.updateValueAndValidity();
  }

  register() {
    this.authService.emailRegister(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value, this.registerForm.controls['company'].value).then((response) => {

    }).catch((error) => {

    });
  }

  googleRegister() {
    this.authService.googleLogin().then((value) => {

    }).catch((error) => {

    });
  }

}

function passwordMatchValidator(group: FormGroup): any {
  if(group) {
    if(group.get('password').value !==group.get('confirm').value) {
      return { notMatching : true };
    }
  }
  return null;
}
