import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { SNavbar } from "../s-navbar/s-navbar";
import { JsonPipe, NgStyle } from '@angular/common';
import { StateService } from '../../../services/state-service';

@Component({
	selector: 'app-s-collection',
	imports: [SNavbar, NgStyle, JsonPipe],
	templateUrl: './s-collection.html',
	styleUrl: './s-collection.scss'
})
export class SCollection {
	constructor(public stateService: StateService) { }

	images = signal<any>([
		{
			"name": "1.jpg",
			"gridSpan": ""
		},
		{
			"name": "2.jpg",
			"gridSpan": ""
		},
		{
			"name": "3.jpg",
			"gridSpan": ""
		},
		{
			"name": "4.jpg",
			"gridSpan": ""
		},
		{
			"name": "5.jpg",
			"gridSpan": ""
		},
		{
			"name": "6.jpg",
			"gridSpan": ""
		},
	]);

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}
}
