import { Component, signal } from '@angular/core';
import { SNavbar } from "../s-navbar/s-navbar";
import { NgStyle } from '@angular/common';
import { StateService } from '../../../services/state-service';
import { Router } from '@angular/router';
import { collection_data } from '../../../data/collection_data';

@Component({
	selector: 'app-s-collection',
	imports: [NgStyle],
	templateUrl: './s-collection.html',
	styleUrl: './s-collection.scss'
})
export class SCollection {
	constructor(public stateService: StateService, private router: Router) { }
	images = signal<any>([]);
	ngOnInit() {
		setTimeout(() => {
			this.images.set(Object.values(collection_data));
		}, 0);
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
