import { Injectable } from '@angular/core';

@Injectable()
export class methodCustom {

    getDateFormat(d): string {
        var date = new Date(d * 1000);
        if (date != null){
            var month = date.getMonth()+1;
            var dat = date.getDate();
        return (month <10 ? "0"+month : month  )+""+(dat <10 ? "0"+dat : dat  )+""+date.getFullYear();
        // +"- "+ date.getHours()+":"+ date.getMinutes(); 

         }else{
             return "XXX";
         }
    
            
        
    }
}