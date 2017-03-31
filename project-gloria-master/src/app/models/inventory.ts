export interface IInventory {
  //$key?: string; Mi UID
  IsAdmin: boolean;
  createdAt: string;
  name: string;
  photoUrl: string;
}

export class Inventory implements IInventory {
  IsAdmin: boolean = false;
  createdAt: string = Date.now().toString();
  name: string;
  key: string;
  photoUrl: string = "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAfwAAAAJGMzMjBhYzIzLTI3NDAtNGNiZi04Yjk0LTVmNDc2ZjY2ODljYw.png";

  constructor(name: string, photoUrl: string = "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAfwAAAAJGMzMjBhYzIzLTI3NDAtNGNiZi04Yjk0LTVmNDc2ZjY2ODljYw.png") {
    this.name = name;
    this.photoUrl = photoUrl;
  }
}
