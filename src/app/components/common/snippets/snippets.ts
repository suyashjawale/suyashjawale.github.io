import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { StateService } from '../../../services/state-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Component({
	selector: 'app-snippets',
	imports: [NgStyle, DatePipe, NgClass],
	templateUrl: './snippets.html',
	styleUrl: './snippets.scss',
})
export class Snippets {

	// snippets = signal<any>([
	// 	{
	// 		"title": 'Code to Copy',
	// 		"timeStamp": new Date(),
	// 		"codeBlocks": [
	// 			{
	// 				"language": 'python',
	// 				"code": `name = input('What is your name? ')
	// print(f'Hi, {name}.')`,
	// 				"title": 'Hello World',
	// 				"explanation": 'Hello world 2'
	// 			},

	// 			{
	// 				"language": 'python',
	// 				"code": `name = input('What is your name? ')
	// print(f'Hi, {name}.')`,
	// 				"title": 'Hello World',
	// 				"explanation": 'Hello world 2'
	// 			}
	// 		]
	// 	},

	// 	{
	// 		"title": 'Code to Copy',
	// 		"timeStamp": new Date(),
	// 		"codeBlocks": [
	// 			{
	// 				"language": 'css',
	// 				"code": `name = input('What is your name? ')
	// print(f'Hi, {name}.')`,
	// 				"title": 'Hello World',
	// 				"explanation": '',
	// 			}
	// 		]
	// 	}
	// ]);

	snippets = signal<any>([]);
	loadingStatus = signal<string>('loading');
	constructor(public stateService: StateService, private http: HttpClient) { }

	ngOnInit() {

		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'X-Site-Identity': 'portfolio-admin-v1'
		});

		this.http.get<any>(environment.domain + '.netlify/functions/getSnippets', { headers }).subscribe({
			next: data => {
				this.snippets.set(data.sort((a: any, b: any) => b.timeStamp - a.timeStamp));
				this.loadingStatus.set('loaded');
			},
			error: err => {
				this.loadingStatus.set('failed')
			}
		});
	}

	async copyCode(block: any) {
		try {
			await navigator.clipboard.writeText(block.code);
			setTimeout(()=>{
				block.copyStatus = 'copied';
			},100);
		} catch (err) {
			block.copyStatus = 'error';
		}
	}
}
