import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
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
			this.http.post<any>("https://dashing-llama-639318.netlify.app/.netlify/functions/updates", {
				"sec-ch-ua-model": data.model || null,
				"sec-ch-ua-platform": data.platform || null,
				"sec-ch-ua-platform-version": data.platformVersion || null,
				"sec-ch-ua-full-version-list": data.uaFullVersion || null,
				"sec-ch-ua-mobile": String(data.mobile) || null
			}).subscribe(res => {

			})
		});
	}


}
