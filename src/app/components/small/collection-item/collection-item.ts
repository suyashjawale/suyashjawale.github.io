import { Component, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { StateService } from '../../../services/state-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Component({
	selector: 'app-collection-item',
	imports: [NgStyle, NgClass],
	templateUrl: './collection-item.html',
	styleUrl: './collection-item.scss',
})
export class CollectionItem {
	constructor(public stateService: StateService, private route: ActivatedRoute, private http: HttpClient) { }

	selected = signal<any>({
		location: ''
	});
	currentStatus = signal<string>('Fetching Data');
	loadingData = signal<string>('loading');

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			const productID = params.get('name');

			const headers = new HttpHeaders({
				'Content-Type': 'application/json',
				'X-Site-Identity': 'portfolio-admin-v1'
			});

			this.http.get<any>(environment.domain + `.netlify/functions/getCollection?name=${productID}`, { headers }).subscribe({
				next: data => {
					this.selected.set(data);
				}
			});
		});
	}

	downloadImage(item: any) {
		this.http.get(item.url, { responseType: 'blob' }).subscribe((blob: Blob) => {
			const a = document.createElement('a');
			const objectUrl = URL.createObjectURL(blob);
			a.href = objectUrl;
			a.download = `${item.identifier}.jpg`;
			document.body.appendChild(a);
			a.click();
			URL.revokeObjectURL(objectUrl);
			document.body.removeChild(a);
		});
	}
}
