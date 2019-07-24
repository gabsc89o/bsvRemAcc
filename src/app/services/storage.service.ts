import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Item } from '../models/ItemsApp.interface';
import { ToastController } from '@ionic/angular';

const STORAGE_KEY = 'bsv-bluetooth';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage,
  	private toastCtrl: ToastController) { }
  //General Toast Function
  async toastMsg(msg) {
    let toast = await this.toastCtrl.create({
      message: JSON.stringify(msg),
      position: 'middle',
      duration: 1500
    });
    await toast.present();
  }
  // CREATE
  addItem(item: Item): Promise<any> {
    return this.storage.get(STORAGE_KEY).then((items: Item[]) => {
      if (items) {
        items.push(item);
        return this.storage.set(STORAGE_KEY, items);
      } else {
        return this.storage.set(STORAGE_KEY, [item]);
      }
    });
  }
 
  // READ
  getItems(): Promise<Item[]> {
    return this.storage.get(STORAGE_KEY);
  }
 
  // UPDATE
  updateItem(item: Item): Promise<any> {
    return this.storage.get(STORAGE_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }
 
      let newItems: Item[] = [];
 
      for (let i of items) {
          newItems.push(i);
      }
      return this.storage.set(STORAGE_KEY, newItems);
    });
  }

  // DELETE
  deleteItem(id: string): Promise<Item> {
    return this.storage.get(STORAGE_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let toKeep: Item[] = [];
     /* for (let i of items) {
          toKeep.push(i);
      }*/
      return this.storage.set(STORAGE_KEY, toKeep);
    });
  }
}
