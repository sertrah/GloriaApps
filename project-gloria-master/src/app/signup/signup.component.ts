import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../router.animations';
import { IUser, User } from '../models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class SignupComponent implements OnInit {

  state: string = '';
  error: any;

  noMatch: boolean = false;
  password_init = "";
  passAreEqual = false;

  constructor(public af: AngularFire, private router: Router) {

  }

  validate(event: any) {
    if (event.target.value == this.password_init) {
      this.passAreEqual = true;
      alert("Same passwords");
    } else {
      this.passAreEqual = false;
    }
  }

  onSubmit(formData) {
    if (formData.valid) {
      if (this.passAreEqual) {
        console.log(formData.value);
        this.af.auth.createUser({
          email: formData.value.email,
          password: formData.value.password
        }).then(
          (success) => {
            console.log(success);
            this.router.navigate(['/login']);
            this.af.database.object('users/' + success.uid).set(new User(formData.value.namef));
          }).catch(
          (err) => {
            console.log(err);
            this.error = err;
          })
      } else {
        this.noMatch = true;
        alert("Passwords do not consider")
      }
    }
  }
  ngOnInit() {
  }

}
