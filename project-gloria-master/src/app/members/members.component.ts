import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods,FirebaseListObservable } from 'angularfire2';
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
  host: {'[@moveIn]': ''}
})
export class MembersComponent implements OnInit {


  public ObjUser: Object[] = [];
  public itemsP : any;
  public purchaseditm : any;
    fileList : FirebaseListObservable<Image[]>;
    imageList : Observable<Image[]>;
  constructor(public af: AngularFire,private router: Router) {
    
    this.af.auth.subscribe(auth => {
      if(auth) {
          this.af.database.list('/users/'+auth.uid, { preserveSnapshot: true})
          .subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              this.ObjUser[snapshot.key] = snapshot.val();
            
            });
        });
            let storage = firebase.storage();
            this.fileList = this.af.database.list(`/inventory`);
            this.imageList = this.fileList.map( itemList =>
            itemList.map( item => {
                var pathReference = storage.ref(item.path).getDownloadURL().then(url => {  return url });
                let result = {$key: item.$key, downloadURL: pathReference, path: item.path, product: item.product, price: item.price, quantity: item.quantity};
                console.log(result);
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
 init(a) {
      let items = [{q: "a-1", p: "pathReference"},{q: "item.1", p: "pathReference2"}];
      let purchaseditm = [{q: a+1, p: "pathReference"},{q: "item.1", p: "pathReference2"}];
       
        this.itemsP = items;
        console.log(a);
 return 1;
  }

}
