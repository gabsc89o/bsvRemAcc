import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { Item } from '../../models/ItemsApp.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
	source$: Observable<any>;
	private subscription: Subscription;
	user:string;
	password:string;
	//modificar servidor login
	archivoValidacion:string = "http://www.eypools.net/eypools_2015/login/loginMovil.php?";
	entry: boolean;
	newItem: Item = <Item>{};
	items: Item[] = [];
  constructor(private router: Router,
  	private browser:InAppBrowser,
  	private http: HttpClient,
	private storageService: StorageService
  	) { }

  ngOnInit() {
  }
  async goToHome(){
    await this.router.navigate(['/welcome']);
  }
  async goToRemote(){
	  	this.items = await this.loadItems();
        this.subscription = this.http.get(this.archivoValidacion,{params: {usuario: this.user, password: this.password}})
        .subscribe(      
		response => this.onAvailable(response), 
      	error => this.onReqError(error)
    );
  }
  async onAvailable(data){
  	try{
        if (data.validacion == "ok") {
        	this.storageService.toastMsg("Conectando... / Loading...");
        	if (this.entry) {
        		this.items = await this.loadItems();
        		if (this.items == null || this.items.length == 0) {
        			//insert
        			await this.addItem();
        		} else {
        			//update
				  	this.items = await this.loadItems();
				  	await this.deleteItem();
        			await this.addItem();
        		}
        	}
		  	const options:InAppBrowserOptions = {
		  		zoom:'no',
		  		clearcache:'yes',
		  		location:'no'
		  	}
		  	// self, blank, system
			const webpage = await this.browser.create(data.url,'_self',options);
        } else {
        	this.storageService.toastMsg("Usuario o contraseña incorrectos / User or password is incorrect.");
            //await this.goToHome();
        }
  	} catch (e){
  		this.storageService.toastMsg("error: "+e);
  	}
  }
  onReqError(e){
  	this.storageService.toastMsg("error request: "+JSON.stringify(e));
  }
  // ***************STORAGE
  // CREATE
  async addItem() {
    try {
          	this.newItem.modified = Date.now();
		    this.newItem.user = this.user;
		    this.newItem.value = this.password;
		    this.newItem.remember = true;
        	await this.storageService.addItem(this.newItem).then(item => {
            	this.newItem = <Item>{};
        	});
    } catch (e){
      this.storageService.toastMsg("error: "+e);
    }
  }
  // READ
  async loadItems() {
  	try{
	    await this.storageService.getItems().then(items => {
	      this.items = items;
	    });
	    return this.items;
  	} catch (e){
      this.storageService.toastMsg("error: "+e);
    }
  }
  // DELETE
  async deleteItem() {
  	try{
	    await this.storageService.deleteItem(this.user).then(item => {
	      this.newItem = <Item>{};
	      this.loadItems();
	    });  		
  	} catch (e){
      this.storageService.toastMsg("error: "+e);
    }
  }
}
