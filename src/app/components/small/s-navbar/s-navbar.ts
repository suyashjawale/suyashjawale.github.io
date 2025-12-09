import { NgClass, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StateService } from '../../../services/state-service';
import { MusicPlayer } from '../../../services/music-player';
import { Router } from '@angular/router';

@Component({
	selector: 'app-s-navbar',
	imports: [NgClass],
	templateUrl: './s-navbar.html',
	styleUrl: './s-navbar.scss'
})
export class SNavbar {
	musicPlayer = inject(MusicPlayer);
	router = inject(Router);
}
