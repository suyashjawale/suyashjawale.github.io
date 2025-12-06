import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
		});
	}

	async ngOnInit() {
		// this.getClientHint().then((data)=>{
		// 	this.http.post("")
		// });
		this.data1.set(await this.getClientHint())
	}


}
