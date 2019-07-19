import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
//import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

	user:string;
	password:string;
	archivoValidacion:string = "http://www.eypools.net/eypools_2015/login/loginMovil.php?";
	//"http://www.eypools.net/eypools_2015/login/loginMovil.php?usuario=test&password=test";
// https://jsonplaceholder.typicode.com/posts/1
  constructor(private router: Router,
  	private browser:InAppBrowser,
  	private http: HttpClient,
  	//private http2:HTTP
  	) { }

  ngOnInit() {
  }
  async goToHome(){
    await this.router.navigate(['/welcome']);
  }
  goToRemote(){
	let param = {usuario: this.user, password: this.password}//+"usuario="+this.user+"&password="+this.password
	  	console.log("remote");
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  }),
  method: 'get',
 // params: new HttpParams().set('usuario', this.user).set('password', this.password)
};
	this.http.get(this.archivoValidacion+"usuario="+this.user+"&password="+this.password,httpOptions).subscribe(      
		response => this.onAvailable(response), 
      	error => this.onReqError(error)
    );
/*	try{
	  	this.http.get("https://jsonplaceholder.typicode.com/posts/1",{},{}).then(data => {
	    console.log(data.status);
	    console.log(data.data); // data received by server
	    console.log(data.headers);
	  })
	  .catch(error => {
	  	console.log("error");
	    console.log("e"+error);
	    console.log(error.error); // error message as string
	    console.log(error.headers);
	  });			
	} catch(error){
		console.log("e"+error);
	}*/
	

   /* getJSON(this.archivoValidacion, {usuario: this.user, password: this.password}).done(function (respuestaServer) {
        if (respuestaServer.validacion == "ok") {
            if ($('#recuerdame').prop('checked')) {
                localStorage.setItem("recuerdame", "si");
                localStorage.setItem("datosUsuario", this.user);
                localStorage.setItem("datosPassword", this.password);
            }

            window.open(respuestaServer.url, '_self', 'location=no');
        } else {
            alert("usuario o password no válidos");
        }
    })*/
  }
  onAvailable(data){
  	console.log("data");
	console.log(JSON.stringify(data));
  }
  onReqError(e){
  	console.log("error");
  	console.log(e);
  }
}
