import { computed, Injectable, signal } from '@angular/core';
import { Highlights } from '../interfaces/Highlights';

@Injectable({
	providedIn: 'root'
})

export class StateService {
	interaction = signal<number>(1);
	navHeight = signal<number>(0);
	searchTab = signal<string>("");
	collectionList = signal<any>([]);

	highLights = signal<Highlights[]>([]);

	sortedHighLights = computed(() => {
		return this.highLights().sort((a, b) => a.rank - b.rank);
	});

}
