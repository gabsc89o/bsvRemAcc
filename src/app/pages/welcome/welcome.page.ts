import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

	url:string = "http://192.168.7.201/html/rubatec/public/index.php/login";

  constructor(private router: Router,
  	private browser:InAppBrowser) { }

  ngOnInit() {
  }
  openLocal(){
  	const options:InAppBrowserOptions = {
  		zoom:'no',
  		clearcache:'yes',
  		location:'no'
  	}
  	// self, blank, system
	const webpage = this.browser.create(this.url,'_self',options);
  }
  async goToAuth(){
    await this.router.navigate(['/auth']);
  }
}
