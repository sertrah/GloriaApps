import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth, AngularFire, FirebaseListObservable } from "angularfire2/angularfire2";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase';

@Injectable()
export class QueryDB  {
    fileList: FirebaseListObservable<any[]>;
    anyList: Observable<any[]>;
    constructor(private auth: AngularFireAuth, private router: Router, public af: AngularFire) {

    }

    listProductForClient(url: string ): any {
        let storage = firebase.storage();
        this.fileList =  this.af.database.list(url);
        this.anyList =  this.fileList.map(itemList =>
          itemList.map(item => {
            var pathReference = storage.ref(item.path).getDownloadURL().then(url => { return url });
            let result = { $key: item.$key, downloadURL: pathReference, path: item.path, product: item.product, price: item.price, quantity: item.quantity };

            return result;
          })
        );
        return this.anyList;
    }
    db_af_ref(url: string ): any{
       return  firebase.database().ref(url);
    }
    getData(url: string){
          var quantityProduct = firebase.database().ref(url);
          quantityProduct.on('value', snapshot => { quantityProduct = snapshot.val(); }); 
          return quantityProduct;    
    }
    removeItem(url: string, key: string): any{
        const transaction = this.af.database.list(url);
        transaction.remove(key);
    }

 
}