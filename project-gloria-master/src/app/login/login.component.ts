import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { moveIn } from '../router.animations';
import { IUser, User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [moveIn()],
  host: { '[@moveIn]': '' }
})
export class LoginComponent implements OnInit {

  error: any;
  private users: FirebaseListObservable<IUser[]>;

  constructor(public af: AngularFire, private router: Router) {

    this.af.auth.subscribe(auth => {

      if (auth) {
        this.router.navigateByUrl('/members');

        const path = `users`;
        this.users = af.database.list(path);

      }

    });
  }

  loginFb() {
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    }).then(
      (success) => {
        this.router.navigate(['/members']);
        const item = this.af.database.object('users/' + success.uid, { preserveSnapshot: true });
        item.subscribe(snapshot => {
          if (snapshot.val()) {
            
          } else {
            this.af.database.object('users/' + success.uid).set(new User(success.auth.displayName, success.auth.photoURL));
            
          }
        });

      }).catch(
      (err) => {
        this.error = err;
      })
  }

  loginGoogle() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    }).then(
      (success) => {
        this.router.navigate(['/members']);
        const item = this.af.database.object('users/' + success.uid, { preserveSnapshot: true });
        item.subscribe(snapshot => {
          if (snapshot.val()) {
            
          } else {
            this.af.database.object('users/' + success.uid).set(new User(success.auth.displayName, success.auth.photoURL));
            
          }
        });
        

      }).catch(
      (err) => {
        this.error = err;
      })
  }


  ngOnInit() {
  }

}
