import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {
  users: any[] = [];
  usersRef: FirebaseListObservable<any>;
  priceTotals: number = 0;
  tran: FirebaseListObservable<any>;

  constructor(private af: AngularFire, private router: Router) {
  }

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
            })
          })
        });
      });
    });
  }

  onCheck(useruid) {
    if (confirm("va a cancelar toda la deuda de este usuario, esat seguro ?")) {
      this.af.database.list('/purchased/' + useruid).subscribe((dates) => {
        dates.map((date) => {
          var purchased = this.af.database.list('/purchased/' + useruid + '/' + date.$key)
          purchased.subscribe((purchases) => {
            purchases.map((purchase) => {
              purchased.update(purchase.$key, { Ispaid: true });
            });
          });
        });
      });
    } else {
      return false;
    }
  }
}
