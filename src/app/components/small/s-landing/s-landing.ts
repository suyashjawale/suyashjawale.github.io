import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SSidebar } from '../s-sidebar/s-sidebar';
import { RouterOutlet } from '@angular/router';
import { StateService } from '../../../services/state-service';

@Component({
	selector: 'app-s-landing',
	imports: [SSidebar, RouterOutlet],
	templateUrl: './s-landing.html',
	styleUrl: './s-landing.scss'
})

export class SLanding {
	
	constructor(private RootScope: StateService) { }
	
	@HostListener('click')
	onClick(): void {
		if (this.RootScope.interaction() != 0) {
			this.RootScope.interaction.update(val => val + 1);
		}
	}
	// @ViewChild('helloworld') helloworld!: ElementRef;

	// @HostListener('window:scroll', ['$event'])
	// onScroll(event: Event) {
	// 	this.helloworld.nativeElement.click();
	// 	if(this.RootScope.interaction()!=0){
	// 		this.RootScope.interaction.update(val => val+1);
	// 	}
	// }

	// hello(){
	// 	if(this.RootScope.interaction()!=0){
	// 		this.RootScope.interaction.update(val => val+1);
	// 	}
	// }
}
