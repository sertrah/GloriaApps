import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { IInventory, Inventory } from '../models/inventory';
import * as firebase from 'firebase';

import { Observable } from 'rxjs';


interface Image {
    path: string;
    product?: string;
    price?: any;
    quantity?: any;
    downloadURL?: string;
    $key?: string;

}
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
   
   public ObjProd: Object[] = [];
    public ObjImg: FirebaseListObservable<any[]>;
   //image gestor

    @Input() folder: string;
    
    fileList : FirebaseListObservable<Image[]>;
    imageList : Observable<Image[]>;
  constructor(public af: AngularFire,private router: Router) {
        let storage = firebase.storage();
      this.ObjProd["path"] = " ";
        this.fileList = this.af.database.list(`/inventory`);
        this.imageList = this.fileList.map( itemList =>
            itemList.map( item => {
                var pathReference = storage.ref(item.path).getDownloadURL().then(url => {  return url });
                let result = {$key: item.$key, downloadURL: pathReference, path: item.path, product: item.product, price: item.price, quantity: item.quantity};
                return result;
            })
        );

   }


//   delReg(id_prdc){
//      this.items.remove(id_prdc);
//   }
  openModal(idProduc, type){
      console.log(idProduc);
    if(type){
           this.ObjProd["key"] = idProduc;
           
           this.ObjProd["type"] = type;
          this.af.database.list('/inventory/'+idProduc, { preserveSnapshot: true})
          .subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              this.ObjProd[snapshot.key] = snapshot.val();
              if(snapshot.key != "path"){
                 this.ObjProd[snapshot.key] = snapshot.val();
              }else{
                    const storageRef = firebase.storage().ref().child(snapshot.val());
                    storageRef.getDownloadURL().then(url =>  this.ObjProd["path"]  = url);
              }
            });
          });
         
    }else{
         const storageRef = firebase.storage().ref().child('images/noimg.jpg');
         storageRef.getDownloadURL().then(url =>  this.ObjProd["path"]  = url);
           this.ObjProd["key"] = idProduc;
           this.ObjProd["type"] = type;
           delete this.ObjProd["price"];
           delete this.ObjProd["quantity"];
           delete this.ObjProd["path"];
           delete this.ObjProd["product"];
    }
          
    
  }
  ngOnInit() {
  }
  SubmitData(formData, path) {
     var product= this.validFieldForm(formData.productN, "product" );
     var price= this.validFieldForm(formData.price, "price" );
     var quantity= this.validFieldForm(formData.quantity, "quantity" );
     var path= path;
        if(this.ObjProd["type"]){
        this.fileList.update(this.ObjProd["key"], new Inventory(product, price, quantity, path));
        console.log(product, price, quantity,path);
        console.log("true");
        }else if(this.ObjProd["type"] == false){
        this.fileList.push(new Inventory(product, price, quantity, path));
        console.log(product, price, quantity,path);
        console.log("false");
        }
    }

  validFieldForm(value, Idnty){
    if(value){
     
      return value;
    }else{

      return this.ObjProd[Idnty];
    }
  }
    ngOnChanges() {
        console.log("new values for folder");
        let storage = firebase.storage();
        
        this.fileList = this.af.database.list(`/images`);
        console.log("Rendering all images in ",`/images`)
        this.imageList = this.fileList.map( itemList =>
            itemList.map( item => {
                var pathReference = storage.ref(item.path);
                let result = {$key: item.$key, downloadURL: pathReference.getDownloadURL(), path: item.path, product: item.product};
                console.log(result);
                return result;
            })
        );
    }
   onSubmit(formData) {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        let success = false;
        // This currently only grabs item 0, TODO refactor it to grab them all
         for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
             console.log(selectedFile);
              //Make local copies of services because "this" will be clobbered
             let router = this.router;
             let af = this.af;
             let folder = this.folder;
             let path = `/images/${selectedFile.name}`;
             var iRef = storageRef.child(path);
             iRef.put(selectedFile).then((snapshot) => {
                 console.log('Uploaded a blob or file! Now storing the reference at',`/images/`);
                  console.log('Uploaded a now reference at',`/inventory/`);
                 this.SubmitData(formData,path);

             });
         }
        
    }
    delete(a, k) {
        let storagePath = a;
        let referencePath = k;
        console.log(storagePath, referencePath);
        // Do these as two separate steps so you can still try delete ref if file no longer exists

        // Delete from Storage
        // firebase.storage().ref().child(storagePath).delete()
        // .then(
        //     () => {},
        //     (error) => console.error("Error deleting stored file",storagePath)
        // );

        // Delete references
        // this.af.database.object(referencePath).remove()
            
        

    }

}