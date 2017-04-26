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
  imagen?: string;

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
  private FlagAuth: any = false;
  imgnolist: string = "https://firebasestorage.googleapis.com/v0/b/gloriaapps-a00ed.appspot.com/o/images%2Fnoimg.jpg?alt=media&token=ca822b00-4db9-4acd-9215-c3f7b47f9f45";

  ProductObj: any[] = [];
  cartPrice: number= 0;
  constructor(public af: AngularFire, private router: Router, private qDB: QueryDB) {

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.FlagAuth = true;
        this.authReg = auth.uid;
        const items = this.af.database.list('/transaction/'+this.authReg);
        items.remove();
       
      }
    });

  }



  ngOnInit() {
        
    this.loadRegProducts();
  }
  loadRegProducts(){
        this.ProductObj = [];
        this.af.database.list("inventory").subscribe(list => {
            this.ProductObj = list;
            this.ProductObj.map(product => {
                // Child references can also take paths delimited by '/'
                let storage = firebase.storage();
                var storageRef = storage.ref();
                var spaceRef = storageRef.child(product.path);
                var errors = false;
                // Get the download URL
                var imge = spaceRef.getDownloadURL().then((url) => {
                    // Insert url into an <img> tag to "download"
                    product.imagen= url;
                    return url;
                }).catch((error: any) => {
                    switch (error.code) {
                        case 'storage/object_not_found':
                            // File doesn't exist
                            console.log(error);
                            errors = true;
                            break;

                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            console.log(error);
                            errors = true;
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            console.log(error);
                            errors = true;
                            break;



                        case 'storage/unknown':
                            // Unknown error occurred, inspect the server response
                            console.log(error);
                            errors = true;
                            break;
                    }
                });
                console.log(this.ProductObj, imge);
            });
        });
        return this.ProductObj;
  }
  addCart(productObj, i, b= false) {
    if(this.FlagAuth){ 
        
    var date = new Date();
    var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
    var transactionRef = firebase.database().ref('/transaction/' + this.authReg + '/' + (date_Currentdate) + '/' + productObj.$key + "/transaction");
        transactionRef.transaction( (transaction) => {
          var quantityProduct = this.qDB.getData('inventory/' + productObj.$key + '/quantity');          
          if (transaction < quantityProduct && b== false) {
              var current = transaction + 1;
              return current;
          }if(transaction >= 1 && b== true) {             
              return transaction-1;            
          }          
          if(transaction == null){
              return transaction++;
          }
        }).then(
        (success) => {          
          if(success.committed && !b){
            this.addProduct({ prod: productObj.product, url: productObj.imagen, p: productObj.price, q: success.snapshot.A.B, key: productObj.$key, quantityT: productObj.quantity },true);
             this.cartPrice += +productObj.price;
          }if(success.committed && b){
            this.addProduct({ prod: productObj.product, url: productObj.imagen, p: productObj.price, q: success.snapshot.A.B, key: productObj.$key, quantityT: productObj.quantity },false);
            this.cartPrice = this.cartPrice - productObj.price;
            console.log(this.cartPrice - productObj.price)
          }
        }).catch(
          (err) => {
            console.log(err);
          })
    }else{
       location.reload();
        
    }
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


  // your use is value.toDateString.slice(start,end)
  // private toDateString(date: Date): string {
  //     return (date.getFullYear().toString() + '/' 
  //       + ("0" + (date.getMonth() + 1)).slice(-2) + '/' 
  //       + ("0" + (date.getDate())).slice(-2))
  //       + 'T' + date.toTimeString().slice(0,5);
  // }

}
