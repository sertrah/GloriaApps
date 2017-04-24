import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit {
  public ObjUser: Object[] = [];
  public priceTotal: number = 0;
  constructor(public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.af.database.list('/users/' + auth.uid, { preserveSnapshot: true })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.ObjUser[snapshot.key] = snapshot.val();

            });
          });
        this.getUserPending(auth.uid);
      }
    });
   }

  logout() {
    this.af.auth.logout();
    console.log('logged out');
    this.router.navigateByUrl('/login');
  }
  ngOnInit() {
  }
    getUserPending(uid){

      this.af.database.list('/purchased/'+uid).subscribe((hola) =>{
        //clean var 
        this.priceTotal = 0;
        hola.map((m) =>{
          
            this.af.database.list('/purchased/'+uid+'/'+m.$key).subscribe((a) =>{

              a.map((c)=> {

                  if(c.price != null && c.Ispaid == false){
                  this.priceTotal += parseFloat(c.price) * c.quantity ;
                  }

            });
        })
      })
      
      });


    }
}
