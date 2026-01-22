import { Component } from '@angular/core';
import { StateService } from '../../../services/state-service';
import { NgStyle, NgClass, DatePipe } from '@angular/common';

@Component({
	selector: 'app-s-updates',
	imports: [NgStyle, NgClass, DatePipe],
	templateUrl: './s-updates.html',
	styleUrl: './s-updates.scss',
})
export class SUpdates {
	constructor(public RootScope: StateService) { }
	openLink(link: string) {
		window.open(link);
	}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}
}
