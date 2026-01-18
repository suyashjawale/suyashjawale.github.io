import { Component, signal } from '@angular/core';
import { project_data } from '../../../data/projects_data';
import { StateService } from '../../../services/state-service';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-s-projects',
	imports: [NgStyle],
	templateUrl: './s-projects.html',
	styleUrl: './s-projects.scss'
})

export class SProjects {
	projectData = signal<any>([]);
	safeYoutubeUrls = signal<SafeResourceUrl[]>([]);

	constructor(public stateService: StateService, private router: Router, private sanitizer: DomSanitizer) { }

	onImgLoad(e: Event, ind: number) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}

	openProject(routeName: string) {
		this.router.navigate(['/project', routeName])
	}

	ngOnInit() {
		setTimeout(() => {
			this.projectData.set(Object.values(project_data));
			this.safeYoutubeUrls.set(this.projectData().map((data: any) =>
				this.sanitizer.bypassSecurityTrustResourceUrl(data.yt_link)
			));
		}, 0);
	}
}
