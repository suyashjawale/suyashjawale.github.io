import { computed, Injectable, signal } from '@angular/core';
import { Song } from '../interfaces/song';

@Injectable({
	providedIn: 'root'
})

export class StateService {
	interaction = signal<number>(1);
}
