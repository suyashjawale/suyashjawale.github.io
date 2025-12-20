import { Component, ElementRef, ViewChild } from '@angular/core';
import { SNavbar } from "../s-navbar/s-navbar";
import { project_data } from '../../../data/projects_data';
import { StateService } from '../../../services/state-service';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';

@Component({
	selector: 'app-s-projects',
	imports: [SNavbar, NgStyle],
	templateUrl: './s-projects.html',
	styleUrl: './s-projects.scss'
})

export class SProjects {
	projectData : any = Object.values(project_data);

	constructor(public stateService: StateService, private router: Router) {}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}

	openProject(routeName: string) {
		this.router.navigate(['/project', routeName])
	}
}
