import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import {methodCustom} from './../app.methods';
import { Observable } from 'rxjs';
interface purchasedprop {
    Ispaid: boolean;
    name: string;
    price: number;
    quantity: number;
    $key?: string;
    date: string;

}
@Component({
  selector: 'app-historymembers',
  templateUrl: './historymembers.component.html',
  styleUrls: ['./historymembers.component.css']
})
export class HistorymembersComponent implements OnInit {
  items: FirebaseListObservable<any>;
  itemslist: Object[] = [];
  constructor(public af: AngularFire, private mc: methodCustom) {
    this.af.auth.subscribe(auth => {
      this.af.database.list('/purchased/'+auth.uid).subscribe((a) =>{
          a.map((m) =>{
            console.log(m.$key);
               this.af.database.list('/purchased/'+auth.uid+'/'+m.$key).subscribe((a) =>{
                 //clear my var 
                 this.itemslist = [];
                a.map((c)=> {
                  console.log(c);
                  var dateF = this.mc.getDateFormat(c.date) ;
                  //var pay =  c.Ispaid == true ? 'Payout' : 'Pending' ;
                  let result = { Ispaid:  c.Ispaid, name: c.name, price: c.price, quantity: c.quantity, date: (c.date* 1000)};
                  this.itemslist.push(result);
                  
                  // this.itemslist[name] = c.val().name;
                  });
              })
            })
        
          });
      });

  }

  ngOnInit() {

  }
}