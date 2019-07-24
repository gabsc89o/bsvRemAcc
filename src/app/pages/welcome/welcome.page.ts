import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { StorageService } from '../../services/storage.service';
import { Item } from '../../models/ItemsApp.interface';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
	source$: Observable<any>;
	private subscription: Subscription;
	//url de conexion local
	url:string = "http://192.168.42.1:8080";
	newItem: Item = <Item>{};
	items: Item[] = [];
	//url de conexion remota, cambiar php de login
	archivoValidacion:string = "http://www.eypools.net/eypools_2015/login/loginMovil.php?";
  constructor(private router: Router,
  	private browser:InAppBrowser,
  	private http: HttpClient,
  	private storageService: StorageService) { }

  ngOnInit() {
  }
  async openLocal(){
  	try{
  		this.storageService.toastMsg("Conectando... / Loading...");
	  	const options:InAppBrowserOptions = {
	  		zoom:'no',
	  		clearcache:'yes',
	  		location:'no'
	  	}
	  	// self, blank, system
		const webpage = await this.browser.create(this.url,'_self',options);  		
  	} catch (e){
  		this.storageService.toastMsg("error: "+e);
  	}
  }
  async goToAuth(){
  	try{
	  	this.items = await this.loadItems();
	  	if (this.items != null || this.items.length > 0) {
		  	if (this.items[0].remember == true) {
		  		this.goToRemote();
		  	} else {
		    	await this.router.navigate(['/auth']);  		
		  	}  	
	  	} else {
	  		this.storageService.toastMsg("Ingrese usuario y contraseña / Enter user and password");
		    await this.router.navigate(['/auth']);  		
		}  	
	} catch(e){
	  	if (e instanceof TypeError) {
	  		this.storageService.toastMsg("Ingrese usuario y contraseña / Enter user and password");
	  		await this.router.navigate(['/auth']);
	  	} else {
	  		this.storageService.toastMsg("error: "+e);
	  	}
	}
  }
  //Limpiar local storage
  async logOut(){
  	try{
	  	this.items = await this.loadItems();
	  	await this.deleteItem();  
      this.storageService.toastMsg("Se ha cerrado la sesión / Logging out successful");		
	  } catch (e){
      if (e instanceof TypeError) {
        this.storageService.toastMsg("Se ha cerrado la sesión / Logging out successful");
      } else {
        this.storageService.toastMsg("error: "+e);
      }
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
	    await this.storageService.deleteItem(this.items[0].user).then(item => {
	      this.newItem = <Item>{};
	    });  		
  	} catch (e){
  		this.storageService.toastMsg("error: "+e);
  	}
  }
  async goToRemote(){
  	try{
        this.subscription = this.http.get(this.archivoValidacion,{params: {usuario: this.items[0].user, password: this.items[0].value}})
        .subscribe(      
		response => this.onAvailable(response), 
      	error => this.onReqError(error)
    	);  		
  	} catch (e){
  		this.storageService.toastMsg("error: "+e);
  	}
  }
  async onAvailable(data){
  	try{
        if (data.validacion == "ok") {
        	this.storageService.toastMsg("Conectando... / Loading...");
		  	const options:InAppBrowserOptions = {
		  		zoom:'no',
		  		clearcache:'yes',
		  		location:'no'
		  	}
		  	// self, blank, system
			const webpage = await this.browser.create(data.url,'_self',options);
        } else {
            await this.storageService.toastMsg("Password or User had been changed. Log out and try again.");
        }
  	} catch (e){
  		this.storageService.toastMsg("error: "+e);
  	}
  }
  onReqError(e){
  	this.storageService.toastMsg("error request: "+JSON.stringify(e));
  }
}
