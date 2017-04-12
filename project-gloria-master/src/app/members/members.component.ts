import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { Observable } from 'rxjs';
import { QueryDB } from './../app.conection';
import * as firebase from 'firebase';

interface Image {
  path: string;
  product?: string;
  price?: any;
  quantity?: any;
  downloadURL?: string;
  $key?: string;

}
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: { '[@moveIn]': '' }
})
export class MembersComponent implements OnInit {


  public ObjUser: Object[] = [];
  public ObjCart: any[] = [];
  private authReg: any;
  public priceTotal: number = 0;
  imageList: Observable<Image[]>;
  items: FirebaseListObservable<any>;
  constructor(public af: AngularFire, private router: Router, private qDB: QueryDB) {
    
    this.af.auth.subscribe(auth => {
      if (auth) {
        
        this.authReg = auth.uid;
        this.af.database.list('/users/' + auth.uid, { preserveSnapshot: true })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.ObjUser[snapshot.key] = snapshot.val();

            });
          });
        this.imageList = qDB.listProductForClient("inventory");
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
  addCart(a, i) {
    var date = new Date();
    var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
    var adaRankRef = firebase.database().ref('/purchased/' + this.authReg + '/' + (date_Currentdate) + '/' + a.$key + "/transaction");
        adaRankRef.transaction( (currentRank) => {

          var quantityProduct = this.qDB.getData('inventory/' + a.$key + '/quantity');
          
          if (currentRank < quantityProduct) {
              var current = currentRank + 1;
              return current;
          }if(currentRank == null){
              return currentRank++;
          }
        }).then(
        (success) => {        
          if(success.committed == true){
            this.addProduct({ prod: a.product, url: a.downloadURL.pa, p: a.price, q: success.snapshot.A.B, key: a.$key, quantityT: a.quantity });
            console.log(success.committed);
          }
        }).catch(
          (err) => {
            console.log(err);
          })
  }

  addProduct(productToAdd): void {
    let found;
    this.ObjCart.map((product) => {
      if (product.key === productToAdd.key) {
        product.q++;
        found = true;
      }
    });
    if (!found) {
      this.ObjCart.push(productToAdd);
    }
  }
  purchasedItems(){
      this.ObjCart.map((product) => {
      var quantityProduct = this.qDB.getData('inventory/' + product.key + '/quantity');
      if(product.q  <=  quantityProduct ){
        console.log("exitoso");
        var date = new Date();
        var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
        const items = this.af.database.list('inventory/' );
        // update and push the data 
        
        items.update(product.key, { quantity: product.quantityT-product.q });
        this.af.database.list('/purchased/' + this.authReg + '/' + (date_Currentdate) + '/' + product.key ).push({name: product.prod, price: product.p, quantity: product.q,  Ispaid: false });
        //reset my var
        this.qDB.removeItem('/purchased/' + this.authReg + '/' + (date_Currentdate) + '/' + product.key, '/transaction');
        location.reload();
      }

    });
  
}
  getUserPending(uid){

    this.af.database.list('/purchased/'+uid).subscribe((hola) =>{
      hola.map((m) =>{
          this.af.database.list('/purchased/'+uid+'/'+m.$key).subscribe((a) =>{
            a.map((c)=> {
                if(c.price != null ){
                 this.priceTotal += parseFloat(c.price) * c.quantity ;
                }
            })
          });
      })
    });


  }
  // your use is value.toDateString.slice(start,end)
  // private toDateString(date: Date): string {
  //     return (date.getFullYear().toString() + '/' 
  //       + ("0" + (date.getMonth() + 1)).slice(-2) + '/' 
  //       + ("0" + (date.getDate())).slice(-2))
  //       + 'T' + date.toTimeString().slice(0,5);
  // }

}
