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
        // Create a storage reference from our storage service
        var storageRef = storage.ref();
        this.fileList =  this.af.database.list(url);
        this.anyList =  this.fileList.map(itemList =>
          itemList.map(item => {
              // Child references can also take paths delimited by '/'
            var spaceRef = storageRef.child(item.path);
            console.log(item.path);
            // Get the download URL
            spaceRef.getDownloadURL().then((url)  => {
            // Insert url into an <img> tag to "download"
            console.log(url);
            }).catch(function(error: any) {
            switch (error.code) {
                case 'storage/object_not_found':
                // File doesn't exist
                 console.log(error);
                break;

                case 'storage/unauthorized':
                // User doesn't have permission to access the object
                 console.log(error);
                break;

                case 'storage/canceled':
                // User canceled the upload
                 console.log(error);
                break;

                

                case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                 console.log(error);
                break;
            }
            });
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