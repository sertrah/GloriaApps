import { Component, OnInit } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css']
})
export class UserCommentsComponent implements OnInit {
  public comments: any[] = [];
  ObjUser: any[] = [];
  flagComent: boolean = false;
  constructor(public af: AngularFire, private router: Router) { }

  ngOnInit() {
    this.af.auth.subscribe(auth => {
      if (auth) {
        
        this.af.database.list('/users/' + auth.uid, { preserveSnapshot: true })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.ObjUser[snapshot.key] = snapshot.val();

            });
          });
       
         this.loadComen();
         
      }
    });
     
  }
  onSubmit(formData) {
    var date = new Date();
    var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
    this.af.auth.subscribe(auth => {
      const item = this.af.database.list('/comments/' + auth.uid);
      item.push({ subject: formData.subject, commentary: formData.commentary, date: (date_Currentdate) });
    })
  }

  loadComen() {

    this.af.database.list("/comments").subscribe(commentsList => {
      this.comments = [];
      commentsList.map(user => {

        this.af.database.list('/comments/' + user.$key).subscribe((comments) => {
          comments.map((coment) => {
            this.comments.push({ "subject": coment.subject, "commentary": coment.commentary, "date": coment.date });
          })
        });
      });
    });
     this.flagComent = true;
  }
}
