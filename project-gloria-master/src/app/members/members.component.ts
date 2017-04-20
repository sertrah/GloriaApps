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



  public ObjCart: any[] = [];
  private authReg: any;
  imgnolist: string = "https://firebasestorage.googleapis.com/v0/b/gloriaapps-a00ed.appspot.com/o/images%2Fnoimg.jpg?alt=media&token=ca822b00-4db9-4acd-9215-c3f7b47f9f45";
  imageList: Observable<Image[]>;
  items: FirebaseListObservable<any>;
  constructor(public af: AngularFire, private router: Router, private qDB: QueryDB) {
    
    this.af.auth.subscribe(auth => {
      if (auth) {
        
        this.authReg = auth.uid;
        this.imageList = qDB.listProductForClient("inventory");
      }
    });

  }

  logout() {
    this.af.auth.logout();
    console.log('logged out');
    this.router.navigateByUrl('/login');
  }


  ngOnInit() {
    const items = this.af.database.list('/transaction/'+this.authReg);
    items.remove();
  }
  addCart(a, i, b= false) {
    var date = new Date();
    var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
    var adaRankRef = firebase.database().ref('/transaction/' + this.authReg + '/' + (date_Currentdate) + '/' + a.$key + "/transaction");
        adaRankRef.transaction( (currentRank) => {

          var quantityProduct = this.qDB.getData('inventory/' + a.$key + '/quantity');
          
          if (currentRank < quantityProduct && b== false) {
              var current = currentRank + 1;
              return current;
          }if(currentRank >= 1 && b== true) {
             
              return currentRank-1;
            
          }
          
          if(currentRank == null){
              return currentRank++;
          }
        }).then(
        (success) => {
          
          if(success.committed == true && b == false){
            this.addProduct({ prod: a.product, url: a.downloadURL.pa, p: a.price, q: success.snapshot.A.B, key: a.$key, quantityT: a.quantity },true);
          
          }if(success.committed == true && b == true){
            this.addProduct({ prod: a.product, url: a.downloadURL.pa, p: a.price, q: success.snapshot.A.B, key: a.$key, quantityT: a.quantity },false);
            
          }
        }).catch(
          (err) => {
            console.log(err);
          })
  }

  addProduct(productToAdd, bol): void {
    let found;
    if(bol){
      this.ObjCart.map((product) => {
        if (product.key === productToAdd.key) {
          product.q++;
          found = true;
        }
      });
      if (!found) {
        this.ObjCart.push(productToAdd);
      }
    }else{
      this.ObjCart.map((product,i) => {
        if (product.key === productToAdd.key) {
          product.q= product.q-1;
          found = true;

       
        }

      });
    }

  }
  purchasedItems(){
      this.ObjCart.map((product) => {
      var quantityProduct = this.qDB.getData('inventory/' + product.key + '/quantity');
      if(product.q  <=  quantityProduct && product.q > 0){
       
        var date = new Date();
        var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
        const items = this.af.database.list('inventory/' );
        // update and push the data 
        
        items.update(product.key, { quantity: product.quantityT-product.q });
        this.af.database.list('/purchased/' + this.authReg + '/' + (date_Currentdate)).push({name: product.prod, price: product.p, quantity: product.q,  Ispaid: false, keyreference: product.key, date: Math.round(new Date().getTime()/1000) });
        //reset my var
        this.qDB.removeItem('/transaction/' + this.authReg + '/' + (date_Currentdate) + '/' + product.key, '/transaction');
        location.reload();
      }

    });
  
}

  getDate(){
    var date = new Date();
   return  ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
  }
  // your use is value.toDateString.slice(start,end)
  // private toDateString(date: Date): string {
  //     return (date.getFullYear().toString() + '/' 
  //       + ("0" + (date.getMonth() + 1)).slice(-2) + '/' 
  //       + ("0" + (date.getDate())).slice(-2))
  //       + 'T' + date.toTimeString().slice(0,5);
  // }

}
