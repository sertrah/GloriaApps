export interface Icart {
  //$key?: string; Mi UID
  key?: string;
  product?: string;
  price?: number;
  pend?: number;
  path?: string;
}


export class Cartmodel implements Icart{
    constructor(
        public key:string,
        public product:string,
        public price:number,
        public pend:number,
        public path:string
    ) {}
}
