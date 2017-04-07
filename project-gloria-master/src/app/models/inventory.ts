export interface IInventory {
  //$key?: string; Mi UID
  createdAt: string;
  product: string;
  price: number;
  quantity: number;
  path: string;
}

export class Inventory implements IInventory {
  createdAt: string = Date.now().toString();
  product: string;
  price: number;
  quantity: number;
  path: string;

  constructor(product: string,   price: number , quantity: number, path: string ) {
    this.product = product;
    this.price = price;
    this.quantity = quantity;
    this.path = path;
    
  }
}
