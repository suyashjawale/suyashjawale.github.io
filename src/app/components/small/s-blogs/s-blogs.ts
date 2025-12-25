import { Component, signal } from '@angular/core';
import { SNavbar } from "../s-navbar/s-navbar";
import { BLOG_LIST } from '../../blogs/blogs.index';
import { DatePipe, NgStyle } from '@angular/common';
import { StateService } from '../../../services/state-service';
import { Router } from '@angular/router';
@Component({
	selector: 'app-s-blogs',
	imports: [SNavbar, NgStyle, DatePipe],
	templateUrl: './s-blogs.html',
	styleUrl: './s-blogs.scss',
})

export class SBlogs {
	blogs = signal<any>([]);
	constructor(public stateService: StateService, private router: Router) { }

	goToBlog(slug: string) {
		this.router.navigate(['blog', slug]);
	}

	ngOnInit() {
		setTimeout(() => { 
			this.blogs.set(BLOG_LIST);
		}, 0);
	}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}
}
