import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import {methodCustom} from './../app.methods';
import { Observable } from 'rxjs';
import { WindowRef } from './../WindowRef';
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
  userRf: any;
  datAts: string= "";
  datEnds: string= "";
  windows: any;
  constructor(public af: AngularFire, private mc: methodCustom, private winRef: WindowRef) {


  }

  ngOnInit() {
    this.loadData();
    
   this.userWith()
  }
  getClassView(Ispaid){
    this.windows = this.winRef.nativeWindow;
    if( this.windows.outerHeight < 700){
      
      return (Ispaid==true)? 'green lighten-4':'red lighten-4'
     
    }else {
      
      return 'black-text'
    }
  }

     setNewData(a,b){
        var d = new Date(a);
        // var dateForm = a.substring(5,7)+a.substring(8,10)+a.substring(0,4)
        // var dateForm2 = b.substring(5,7)+b.substring(8,10)+b.substring(0,4)
       var dateForm = a.split('/').join('');
       var dateForm2 = b.split('/').join('');
       
      this.loadData( dateForm, dateForm2);
    }
    loadData(dateAt= null, dateEnd =null){
      var dt = new Date();

      var prevDate = dt.getDate() < 10 ? "0"+dt.getDate() : dt.getDate();
      var datAt = dateAt == null? (dt.getMonth()+1)+"01"+dt.getFullYear(): dateAt;
      var datEnd = dateEnd == null? (dt.getMonth()+1)+""+prevDate+dt.getFullYear(): dateEnd;
      
      this.datAts = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-01";
      this.datEnds = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate();
        this.af.auth.subscribe(auth => {

          this.af.database.list('/purchased/'+auth.uid).subscribe((a) =>{
              //clear my var 
              this.itemslist = [];
              a.map((m) =>{
                  this.af.database.list('/purchased/'+auth.uid+'/'+m.$key).subscribe((a) =>{
                  
                    a.map((c)=> {
                      var dateF = this.mc.getDateFormat(c.date) ;
                      if( Number(dateF) >= Number(datAt)   && Number(dateF) <= Number(datEnd)){

             
                      let result = { Ispaid:  c.Ispaid, name: c.name, price: c.price, quantity: c.quantity, date: (c.date* 1000)};
                      this.itemslist.push(result);
                       
                      }
                    

                      });
                  });
                })
            
              });
          });
    }
public num: number=0;
// userWith(){
//           this.af.database.list("/users").subscribe((users: any) => {
//              this.userRf = users;
//             users.map( (user) => {
//                         this.af.database.list('/purchased/'+user.$key).subscribe((a) =>{
//                           if(a.length > 0 ){
                           
//                             a.map((dates) => {
//                              this.af.database.list('/purchased/'+user.$key+'/'+dates.$key).subscribe((purch) =>{
//                                purch.map( (u) =>{
                                 
//                                  user.priceTotal += +u.price;
                                 
//                                })

//                               })

//                             })
//                                  console.log(user.num, user.name, user.$key);
//                                 this.num  = 0;
//                           }else{
//                             console.log(user.name, "no tengo", user.$key);
//                           }
           
//                 })
//             }) 

            
//               });
      
// }

}