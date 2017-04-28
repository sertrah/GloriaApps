import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { methodCustom } from './../app.methods';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sales-view',
  templateUrl: './sales-view.component.html',
  styleUrls: ['./sales-view.component.css']
})
export class SalesViewComponent implements OnInit {
 users: any[] = [];
 datAts: string = "";
datEnds: string = "";
  constructor(private af: AngularFire, private router: Router, private mc: methodCustom) { }

  ngOnInit() {
   this.loadUsersHistory();
    var dt = new Date();
    this.datAts = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-01";
    this.datEnds = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  }
setNewData(a, b) {
    
     //var dateForms = a.substring(5,9)+a.substring(0,2)+a.substring(2,4)
     //var dateForm2s = b.substring(5,9)+b.substring(0,2)+b.substring(2,4)
    var dateForm = a.split('/').join('');
    var dateForm2 = b.split('/').join('');
    this.datAts = a;  
    this.datEnds = b;  
    this.loadUsersHistory(dateForm, dateForm2);
  }
loadUsersHistory(dateAt = null, dateEnd = null){
    var dt = new Date();

    var prevDate = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    var datAt = dateAt == null ? (dt.getMonth() + 1) + "01" + dt.getFullYear() : dateAt;
    var datEnd = dateEnd == null ? (dt.getMonth() + 1) + "" + prevDate + dt.getFullYear() : dateEnd;


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
                 var dateF = this.mc.getDateFormat(transaction.date);
                if (transaction.price  && Number(dateF) >= Number(datAt) && Number(dateF) <= Number(datEnd) ){
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
  getSum():number{
      let sum = 0;
      this.users.forEach(model => {
        sum += parseInt(model.priceTotal);
      });
      return sum;
    }
}
