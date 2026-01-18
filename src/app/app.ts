import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { NavigationStart, NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, NgClass],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	data1 = signal<any>({});
	isLargeScreen = signal<boolean>(true);
	isNavigating = signal(false);

	constructor(private http: HttpClient, private router: Router) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.isNavigating.set(true);
			}
			if (event instanceof NavigationEnd) {
				setTimeout(() => this.isNavigating.set(false), 300);
			}
		});
	}

	getClientHint(): Promise<any> {
		const nav: any = navigator;

		return new Promise((resolve) => {
			if (nav.userAgentData) {
				nav.userAgentData.getHighEntropyValues([
					"model",
					"platform",
					"platformVersion",
					"uaFullVersion",
					"architecture",
					"bitness",
					"mobile",
				]).then((hints: any) => {
					resolve(hints);
				});
			}
			else
				resolve({});
		});
	}

	async ngOnInit() {
		if (window.innerWidth < 768) {
			this.isLargeScreen.set(false);
		}
		// this.getClientHint().then((data) => {
		// 	this.http.post<any>("https://dashing-llama-639318.netlify.app/.netlify/functions/updates", {
		// 		"sec-ch-ua-model": data.model || null,
		// 		"sec-ch-ua-platform": data.platform || null,
		// 		"sec-ch-ua-platform-version": data.platformVersion || null,
		// 		"sec-ch-ua-full-version-list": data.uaFullVersion || null,
		// 		"sec-ch-ua-mobile": String(data.mobile) || null
		// 	}).subscribe(res => {

		// 	})
		// });
	}


}
