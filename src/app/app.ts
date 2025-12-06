import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, JsonPipe],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	data1 = signal<any>({});

	constructor(private http: HttpClient) { }

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
		this.getClientHint().then((data) => {
			const headers = new HttpHeaders({
				"Sec-CH-UA-Model": data.model || null,
				"Sec-CH-UA-Platform": data.platform || null,
				"Sec-CH-UA-Platform-Version": data.platformVersion || null,
				"Sec-CH-UA-Full-Version-List": data.uaFullVersion || null,
				"Sec-CH-UA-Mobile": String(data.mobile)
			});
			this.http.get("https://dashing-llama-639318.netlify.app/.netlify/functions/updates",{ headers }).subscribe(res=>{
				
			})
		});
	}


}
