import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Router } from '@angular/router';
@Component({
  selector: 'app-sales-view',
  templateUrl: './sales-view.component.html',
  styleUrls: ['./sales-view.component.css']
})
export class SalesViewComponent implements OnInit {
 users: any[] = [];
  constructor(private af: AngularFire, private router: Router) { }

  ngOnInit() {
    this.users = [];
    this.af.database.list("/users").subscribe(userList => {
      this.users = userList;
      this.users.map(user => {
        this.af.database.list('/purchased/' + user.$key).subscribe((dates) => {
          var priceTotals = 0;
           user.priceTotal = 0;
           
          dates.map((date) => {
            
            this.af.database.list('/purchased/' + user.$key + '/' + date.$key).subscribe((transactions) => {
              transactions.map((transaction) => {
                if (transaction.price && !transaction.Ispaid) {
                  priceTotals += parseFloat(transaction.price) * transaction.quantity;
                }
              });
              user.priceTotal = priceTotals;
              console.log( user.priceTotal, user.name)
            })
            
          })
          
        });
        
      });
    });
  }

}
