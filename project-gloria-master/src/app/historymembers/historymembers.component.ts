import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { methodCustom } from './../app.methods';
import { ActivatedRoute } from "@angular/router";
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
  @Input() myname: String;
  items: FirebaseListObservable<any>;
  itemslist: Object[] = [];
  datAts: string = "";
  userId: any;
  sub: any;

  datEnds: string = "";
  constructor(public af: AngularFire, private mc: methodCustom, public router: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.router.params.subscribe(p => {
      this.userId = p['id'];
      this.loadData();
    });
  }
  sendNude() {

  }
  setNewData(a, b) {
    var d = new Date(a);
    // var dateForm = a.substring(5,7)+a.substring(8,10)+a.substring(0,4)
    // var dateForm2 = b.substring(5,7)+b.substring(8,10)+b.substring(0,4)
    var dateForm = a.split('/').join('');
    var dateForm2 = b.split('/').join('');

    this.loadData(dateForm, dateForm2);
  }
  loadData(dateAt = null, dateEnd = null) {
    var dt = new Date();

    var prevDate = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    var datAt = dateAt == null ? (dt.getMonth() + 1) + "01" + dt.getFullYear() : dateAt;
    var datEnd = dateEnd == null ? (dt.getMonth() + 1) + "" + prevDate + dt.getFullYear() : dateEnd;

    this.datAts = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-01";
    this.datEnds = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

    this.af.auth.subscribe(auth => {
      var uid = this.userId ? this.userId : auth.uid;
      // console.log(uid);
      this.af.database.list('/purchased/' + uid).subscribe((a) => {
        //clear my var 
        this.itemslist = [];
        a.map((dateKey) => {
          this.af.database.list('/purchased/' + uid + '/' + dateKey.$key).subscribe((a) => {
            a.map((c) => {
              var dateF = this.mc.getDateFormat(c.date);
              if (Number(dateF) >= Number(datAt) && Number(dateF) <= Number(datEnd)) {
                let result = { Ispaid: c.Ispaid, name: c.name, price: c.price, quantity: c.quantity, date: (c.date * 1000), key: c.$key, dateref: dateKey.$key };
                this.itemslist.push(result);
              }
            });
          });
        })
      });
    });
  }

  onCheckPurchased(purchaseObj) {
    console.log(purchaseObj);
    const items = this.af.database.list('/purchased/' + this.userId + '/' + purchaseObj.dateref);
    purchaseObj.Ispaid = !purchaseObj.Ispaid;
    items.update(purchaseObj.key, { Ispaid: purchaseObj.Ispaid });
  }
}