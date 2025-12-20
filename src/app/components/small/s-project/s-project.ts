import { NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';
import { SNavbar } from '../s-navbar/s-navbar';
import { StateService } from '../../../services/state-service';
import { ActivatedRoute, Router } from '@angular/router';
import { project_data } from '../../../data/projects_data';
import { Meta, Title } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-s-project',
	imports: [NgStyle, SNavbar],
	templateUrl: './s-project.html',
	styleUrl: './s-project.scss',
})
export class SProject {

	safeYoutubeUrl!: SafeResourceUrl;

	constructor(public stateService: StateService, private route: ActivatedRoute, private title: Title, private meta: Meta, public sanitizer: DomSanitizer) { }

	projectData = signal<any>({});

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			const data = project_data[params.get('name') as string];
			this.applySeo(data.project_name,data.project_description, data.keywords, "https://suyashjawale.github.io/project/"+data.routeName, data.imgLink, data.contentType,data.publishedDate, data.modifiedDate)
			this.projectData.set(data);
		});
	}

	applySeo(title: string, description: string, keywords: string, itemLink: string, imageLink: string, contentType : string, publishedDate:Date, modifiedDate: Date) {
		this.title.setTitle(title);

		this.meta.updateTag({
			name: 'title',
			content: title
		});

		this.meta.updateTag({
			name: 'description',
			content: description
		});

		this.meta.updateTag({
			name: 'keywords',
			content: keywords
		});

		const link: HTMLLinkElement = document.createElement('link');
		link.setAttribute('rel', 'canonical');
		link.setAttribute('href', itemLink);
		document.head.appendChild(link);

		this.meta.updateTag({ property: 'og:title', content: title });
		this.meta.updateTag({ property: 'og:description', content: description });
		this.meta.updateTag({ property: 'og:type', content: 'article' });
		this.meta.updateTag({ property: 'og:url', content: itemLink });
		this.meta.updateTag({ property: 'og:site_name', content: 'Suyash Jawale' });
		this.meta.updateTag({
			property: 'og:image',
			content: imageLink
		});

		this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
		this.meta.updateTag({ name: 'twitter:title', content: title });
		this.meta.updateTag({ name: 'twitter:description', content: description });
		this.meta.updateTag({
			name: 'twitter:image',
			content: imageLink
		});

		this.meta.updateTag({
			name: 'robots',
			content: 'index, follow'
		});

		this.meta.updateTag({ property: 'article:author', content: 'Suyash Jawale' });
		this.meta.updateTag({ property: 'article:section', content: contentType });
		this.meta.updateTag({ property: 'article:published_time', content: new Date(publishedDate).toISOString() });
		this.meta.updateTag({ property: 'article:modified_time', content: new Date(modifiedDate).toISOString() });

		const schema = {
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": title,
			"@id": title,
			"url": itemLink,
			"description": description,
			"image": [
				imageLink
			],
			"author": {
				"@type": "Person",
				"name": "Suyash Jawale",
				"url": "https://suyashjawale.github.io",
				"logo": {
					"@type": "ImageObject",
					"url": "https://suyashjawale.github.io/android-chrome-512x512.png",
					"width": 512,
					"height": 512
				}
			},
			"datePublished": publishedDate,
			"dateModified": modifiedDate,
			"publisher": {
				"@type": "Organization",
				"name": "Suyash Jawale",
				"logo": {
					"@type": "ImageObject",
					"url": "https://suyashjawale.github.io/android-chrome-512x512.png"
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": itemLink
			},
			"inLanguage": "en",
			"isAccessibleForFree": true
		};

		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(schema);
		document.head.appendChild(script);
	}

	ngOnDestroy() {
		const scripts = document.querySelectorAll('script[type="application/ld+json"]');
		scripts.forEach(s => s.remove());
	}

}
