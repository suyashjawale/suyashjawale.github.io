import { Component, ElementRef, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { SNavbar } from "../s-navbar/s-navbar";
import { JsonPipe, NgStyle, NgClass } from '@angular/common';
import { StateService } from '../../../services/state-service';

@Component({
	selector: 'app-s-posts',
	imports: [SNavbar, NgStyle, NgClass],
	templateUrl: './s-posts.html',
	styleUrl: './s-posts.scss'
})
export class SPosts {
	@ViewChildren('contentDiv', { read: ElementRef }) contentDiv!: QueryList<ElementRef>;
	constructor(public stateService: StateService) { }

	posts = signal<any[]>([
		{
			"title": "",
			"body": `Utah`,
			"location": "utah",
			"imageLink": "nature.avif",
			"datetime": new Date(),
			"imgClip": "",
			"divClip": "",
			"type": ""
		},
		{
			"title": "hello2",
			"body": "hello world 2",
			"location": "utah",
			"imageLink": "portrait.avif",
			"datetime": new Date(),
			"imgClip": "",
			"divClip": "",
			"type": ""
		},
		{
			"title": "hello2",
			"body": "sdsdsd",
			"location": "utah",
			"imageLink": "",
			"datetime": new Date(),
			"imgClip": "",
			"divClip": "",
			"type": ""
		}
	])

	ngAfterViewInit() {
		this.contentDiv.forEach((elementRef: ElementRef, ind: number) => {
			this.applyClip(elementRef.nativeElement, this.posts()[ind], "div");
		});
	}

	applyClip(img: any, post: any, elemType: string) {
		const rect = img.getBoundingClientRect();
		const w = rect.width;
		const h = rect.height;

		const diff = 25;

		const style = {
			width: w + 'px',
			height: h + 'px',
			overflow: 'hidden',
			clipPath: `path('M 0 0 L ${w} 0 L ${w} ${h - (diff * 2)} Q ${w} ${h - diff}, ${w - diff} ${h - diff} L ${diff} ${h - diff} Q 0 ${h - diff}, 0 ${h} Z')`
		};

		if (elemType == 'img') {
			post.imgClip = style;
		}
		else {
			post.divClip = style;
		}
	}

}

