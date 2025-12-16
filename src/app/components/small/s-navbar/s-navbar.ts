import { NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { StateService } from '../../../services/state-service';
import { MusicPlayer } from '../../../services/music-player';
import { Router, RouterLink } from '@angular/router';

@Component({
	selector: 'app-s-navbar',
	imports: [NgClass,RouterLink],
	templateUrl: './s-navbar.html',
	styleUrl: './s-navbar.scss'
})
export class SNavbar {
	musicPlayer = inject(MusicPlayer);
	router = inject(Router);
	stateService = inject(StateService);
	@ViewChild('navDiv') navDiv!: ElementRef<HTMLDivElement>;

	ngAfterViewInit() {
		this.stateService.navHeight.set(this.navDiv.nativeElement.offsetHeight);
	}
}
