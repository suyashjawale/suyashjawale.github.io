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
	dummy1 = signal<any>("");
	dummy2 = signal<any>("");
	constructor(private http: HttpClient) {
		this.http.get("https://dashing-llama-639318.netlify.app/.netlify/functions/updates").subscribe({
			next: data => {
				this.dummy1.set(data);
				this.http.get("https://dashing-llama-639318.netlify.app/.netlify/functions/updates").subscribe({
					next: data1 => {
						this.dummy2.set(data1);
					}
				})
			}
		})
	}
}
