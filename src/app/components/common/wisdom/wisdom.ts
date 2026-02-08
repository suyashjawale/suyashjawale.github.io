import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, signal, StateKey } from '@angular/core';
import { StateService } from '../../../services/state-service';
import { DatePipe, NgStyle } from '@angular/common';

@Component({
	selector: 'app-wisdom',
	imports: [NgStyle, DatePipe],
	templateUrl: './wisdom.html',
	styleUrl: './wisdom.scss',
})
export class Wisdom {

	wisdom = signal<any>([]);
	loadingStatus = signal<string>('loading');

	constructor(private http: HttpClient, public stateService: StateService) { }

	goToBlog(link: string) {
		window.open(link);
	}

	ngOnInit() {

		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'X-Site-Identity': 'portfolio-admin-v1'
		});

		this.http.get<any>(this.stateService.apiGateway() + '.netlify/functions/getWisdom', { headers }).subscribe({
			next: data => {
				this.wisdom.set(data);
				this.loadingStatus.set('loaded');
			},
			error: err => {
				this.loadingStatus.set('failed')
			}
		});
	}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}

}
