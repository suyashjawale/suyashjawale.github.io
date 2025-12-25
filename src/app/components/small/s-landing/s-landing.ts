import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SSidebar } from '../s-sidebar/s-sidebar';
import { Router, RouterOutlet } from '@angular/router';
import { StateService } from '../../../services/state-service';
import { SNavbar } from '../s-navbar/s-navbar';

@Component({
	selector: 'app-s-landing',
	imports: [SSidebar, RouterOutlet, SNavbar],
	templateUrl: './s-landing.html',
	styleUrl: './s-landing.scss'
})

export class SLanding {

	constructor(private RootScope: StateService, public router: Router) { }

	@HostListener('click')
	onClick(): void {
		if (this.RootScope.interaction() != 0) {
			this.RootScope.interaction.update(val => val + 1);
		}
	}
}
