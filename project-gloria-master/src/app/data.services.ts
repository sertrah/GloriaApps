import { AngularFire } from "angularfire2/angularfire2";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class dataService {
    
    constructor(private af: AngularFire, ) {

    }
    
 
}