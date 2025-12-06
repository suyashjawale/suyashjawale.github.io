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
	data1 = signal<any>("");

	constructor(private http: HttpClient) {
		const nav: any = navigator;
		if (nav.userAgentData) {
			nav.userAgentData.getHighEntropyValues().then((hints: any) => {
				this.data1.set(hints);
			});
		} else {
			console.log("Browser does NOT support userAgentData. Falling back to user-agent.");
			console.log("UA:", navigator.userAgent);
		}
	}

}
