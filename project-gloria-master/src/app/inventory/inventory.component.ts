import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
   
   items: FirebaseListObservable<any[]>;
   public ObjProd: Object[] = [];
  constructor(public af: AngularFire,private router: Router) {
      this.items = af.database.list('/inventory');
      console.log(this.items);
   }
  saveData(){
    
    this.items.push({ product: "boombombum", price: 39.2 , quantity: 10, photoURL: "prhoto1231" });
    
  }
  updReg(id_prdc){
     this.items.update(id_prdc, { product: "Galleta", price: 58.2 , quantity: 2, photoURL: "prhoto1231" });
  }
  delReg(id_prdc){
     this.items.remove(id_prdc);
  }
  openModal(idProduc, type){

    if(type){
           this.ObjProd["key"] = idProduc;
           this.ObjProd["type"] = type;
          this.af.database.list('/inventory/'+idProduc, { preserveSnapshot: true})
          .subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              this.ObjProd[snapshot.key] = snapshot.val();
              
            });
          })
    }else{
           this.ObjProd["key"] = idProduc;
           this.ObjProd["type"] = type;
    }
          
    
  }
  onSubmit(formData) {
    if(formData.value.typeProduct){
      console.log(formData.value.photoURL);
    }else{
      console.log(formData.value.namef, formData.value.photoURL);
    }

    }
  ngOnInit() {
  }

}
