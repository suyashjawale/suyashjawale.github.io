import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class StateService {
	interaction = signal<number>(1);
}
