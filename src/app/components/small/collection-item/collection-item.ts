import { Component, signal } from '@angular/core';
import { SNavbar } from '../s-navbar/s-navbar';
import { NgStyle } from '@angular/common';
import { StateService } from '../../../services/state-service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-collection-item',
	imports: [SNavbar, NgStyle],
	templateUrl: './collection-item.html',
	styleUrl: './collection-item.scss',
})
export class CollectionItem {
	constructor(public stateService: StateService, private route: ActivatedRoute) { }

	img_name = signal<any>("");
	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			const productID = params.get('name');
			this.img_name.set(productID);
		});
	}
}
