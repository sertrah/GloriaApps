import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { Observable } from 'rxjs';
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
  public itemsP: any;
  public purchaseditm: any;
  private authReg: any;
  fileList: FirebaseListObservable<Image[]>;
  imageList: Observable<Image[]>;
  constructor(public af: AngularFire, private router: Router) {

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authReg = auth.uid;
        this.af.database.list('/users/' + auth.uid, { preserveSnapshot: true })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.ObjUser[snapshot.key] = snapshot.val();

            });
          });

        let storage = firebase.storage();
        this.fileList = this.af.database.list(`/inventory`);
        this.imageList = this.fileList.map(itemList =>
          itemList.map(item => {
            var pathReference = storage.ref(item.path).getDownloadURL().then(url => { return url });
            let result = { $key: item.$key, downloadURL: pathReference, path: item.path, product: item.product, price: item.price, quantity: item.quantity };

            return result;
          })
        );
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
  init(a, i) {
    // let items = [{q: "a-1", p: "pathReference"},{q: "item.1", p: "pathReference2"}];
    // let purchaseditm = [{q: a+1, p: "pathReference"},{q: "item.1", p: "pathReference2"}];

    //   this.itemsP = items;
    //   console.log(a);
    // Increment Ada's rank by 1.
    var date = new Date();
    var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
    var adaRankRef = firebase.database().ref('/purchased/' + this.authReg + '/' + (date_Currentdate) + '/' + a.$key + "/transaction");
    adaRankRef.transaction( (currentRank) => {
      var currentRanks = currentRank;
      
      var starCountRef = firebase.database().ref('inventory/' + a.$key + '/quantity');
      starCountRef.on('value', snapshot => { starCountRef = snapshot.val() 
      
    
  
     });
      
      if (currentRanks < starCountRef) {
        var current = currentRank + 1;
        return current;
      }if(currentRanks == null){
         return currentRank++;
      }
    }).then(
        (success) => {
        
        if(success.committed == true){
          this.addProduct({ prod: a.product, url: a.downloadURL, p: a.price, q: success.snapshot.A.B, key: a.$key, quantityT: a.quantity });
          console.log(this.ObjCart);
        }
      }).catch(
        (err) => {
        console.log(err);
        
      })
  }

  addProduct(productToAdd): void {
    let found;
    this.ObjCart.map((product) => {
      if (product.prod === productToAdd.prod) {
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
    var date = new Date();
    var date_Currentdate = ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + "-" + date.getFullYear();
   const items = this.af.database.list('inventory/' );
    // to get a key, check the Example app below
    items.update(product.key, { quantity: product.quantityT-product.q });
    this.af.database.object('/purchased/' + this.authReg + '/' + (date_Currentdate) + '/' + product.key ).set({name: product.prod, price: product.p, quantity: product.q });
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
