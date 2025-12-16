import { Component } from '@angular/core';
import { SNavbar } from "../s-navbar/s-navbar";
import { project_data } from '../../../data/projects_data';
import { StateService } from '../../../services/state-service';
import { NgStyle } from '@angular/common';


@Component({
  selector: 'app-s-projects',
  imports: [SNavbar, NgStyle],
  templateUrl: './s-projects.html',
  styleUrl: './s-projects.scss'
})
export class SProjects {
  project_data = project_data;
  constructor(public stateService:StateService){}
  	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}
}
