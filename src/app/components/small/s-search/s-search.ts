import { Component } from '@angular/core';
import { StateService } from '../../../services/state-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-s-search',
	imports: [FormsModule],
	templateUrl: './s-search.html',
	styleUrl: './s-search.scss'
})

export class SSearch {
	searchTopic: string = "";
	constructor(public stateService: StateService, private router: Router) { }

	goBack() {
		this.router.navigate([this.stateService.searchTab()])
	}
}
