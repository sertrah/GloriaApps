import { Injectable } from '@angular/core';

@Injectable()
export class methodCustom {

    getDateFormat(d): string {
        var date = new Date(d * 1000);
        if (date != null){
        return (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+"/ "+ date.getHours()+":"+ date.getMinutes();       
         }else{
             return "XXX";
         }
    
            
        
    }
}