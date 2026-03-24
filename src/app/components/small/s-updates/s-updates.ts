import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { StateService } from '../../../services/state-service';
import { NgStyle, NgClass, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Highlights } from '../../../interfaces/Highlights';
import { environment } from '../../../../environment/environment';

@Component({
	selector: 'app-s-updates',
	imports: [NgStyle, NgClass, DatePipe],
	templateUrl: './s-updates.html',
	styleUrl: './s-updates.scss',
})
export class SUpdates {
	@ViewChild('birthdayButton') birthdayButton!: ElementRef<HTMLInputElement>;
	birthday = signal<any>([]);

	constructor(public RootScope: StateService, private http: HttpClient) { }
	openLink(link: string) {
		window.open(link);
	}

	onImgLoad(e: Event) {
		const img = e.target as HTMLImageElement;
		img.style.animationDelay = `${Math.random() * 120}ms`;
		img.classList.add('reveal');
	}

	openHighlight(highlight: Highlights) {
		if (highlight.isBirthdayHighlight) {
			let result = prompt("Please enter password before proceeding");
			
					const headers = new HttpHeaders({
						'Content-Type': 'application/json',
						'X-Site-Identity': 'portfolio-admin-v1'
					});

			this.http.post<any>(environment.domain + '.netlify/functions/getBirthdays', {
				password: result
			}, {headers}).subscribe({
				next: (data) => {
					this.birthday.set(data);
					this.birthdayButton.nativeElement.click();
				},
				error: err => {
					alert("OOPs, something went wrong")
				}
			});
		}
		else {
			this.openLink(highlight.link);
		}
	}

	wishBirthday(message: string, mob: string) {
		window.open(`https://api.whatsapp.com/send?phone=${mob}&text=${message}`)
	}

}
