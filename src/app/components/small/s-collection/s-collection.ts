import { Component, ElementRef, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { StateService } from '../../../services/state-service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	selector: 'app-s-collection',
	imports: [NgStyle, NgClass],
	templateUrl: './s-collection.html',
	styleUrl: './s-collection.scss'
})
export class SCollection {

	left = signal<any>([]);
	right = signal<any>([]);
	loadingData = signal<string>('loading');

	constructor(public stateService: StateService, private router: Router, private http: HttpClient) { }

	ngOnInit() {
		setTimeout(() => {
			if (this.stateService.collectionList().length == 0) {

				const headers = new HttpHeaders({
					'Content-Type': 'application/json',
					'X-Site-Identity': 'portfolio-admin-v1'
				});

				this.http.get<any>('https://dashing-llama-639318.netlify.app/.netlify/functions/getCollection', { headers }).subscribe({
					next: data => {
						data.sort((a: any, b: any) => a.priority - b.priority);
						this.stateService.collectionList.set(data);
						this.hydrate(data);
					},
					error: err => {
						this.loadingData.set('failed');
					}
				});
			}
			else {
				this.hydrate(this.stateService.collectionList());
			}
		}, 0);
	}

	hydrate(data: any) {
		let arr1: any[] = [];
		let arr2: any[] = [];
		let leftH = 0;
		let rightH = 0;

		data.forEach((img: any) => {
			if (leftH <= rightH) {
				leftH += img.height;
				arr1.push(img);
			} else {
				rightH += img.height;
				arr2.push(img);
			}
		});

		this.left.set(arr1);
		this.right.set(arr2);
		this.loadingData.set('loaded');
	}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}

	openCollectionItem(collectionName: number) {
		this.router.navigate(["/collection", collectionName])
	}
}
