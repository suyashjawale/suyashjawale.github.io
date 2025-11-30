import { Component, computed, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StateService } from '../../../services/state-service';
import { DecimalPipe, NgStyle } from '@angular/common';
import { Highlights } from '../../../interfaces/Highlights';
import { MusicPlayer } from '../../../services/music-player';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-s-sidebar',
	imports: [RouterLink, RouterLinkActive, DecimalPipe, NgStyle],
	templateUrl: './s-sidebar.html',
	styleUrl: './s-sidebar.scss',
})

export class SSidebar {
	isFullScreen = signal(false);
	currentHighlight = signal(0);
	isOpen = signal(false);
	@ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
	@ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>;
	@ViewChild('birthdayButton') birthdayButton!: ElementRef<HTMLInputElement>;

	currentSongTime = signal<number>(0);

	private progressAnimationFrame: number | null = null;
	private isUserSeeking = false;
	birthday = signal<any>([]);
	highLights = signal<Highlights[]>([]);

	sortedHighLights = computed(() => {
		return this.highLights().sort((a, b) => a.rank - b.rank);
	});

	constructor(public playerState: MusicPlayer, public RootScope: StateService, private http: HttpClient) {
		effect(() => {
			if (this.RootScope.interaction() != 0) {
				this.playSong();
			}
		});

		this.http.post<any>('https://dashing-llama-639318.netlify.app/.netlify/functions/getBirthdays', { "password": "" }).subscribe({
			next: (data: any) => {
				this.highLights.update((item) => [...item, ...data.map((item: any) => ({
					uid: '',
					isBirthdayHighlight: true,
					content: `🥳🎉 ${item.message}`,
					imageLink: '',
					hasImage: false,
					link: '',
					rank: 1
				}))]);
			}
		});


		this.http.post('https://dashing-llama-639318.netlify.app/.netlify/functions/getRssNews', { "url": "https://www.theguardian.com/uk/technology/rss" }, { responseType: 'text' })
			.subscribe({
				next: xml => {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(xml.toString(), 'text/xml');
					const items = Array.from(xmlDoc.querySelectorAll('item'));

					this.highLights.update((item) => [...item, ...items.slice(0, 5).map((rss: any) => ({
						uid: '',
						isBirthdayHighlight: false,
						content: rss.querySelector('title')?.textContent,
						hasImage: true,
						imageLink: rss.getElementsByTagName('media:content')[0].getAttribute("url"),
						link: rss.querySelector('link')?.textContent,
						rank: 2
					}))])
				}
			});

		this.http.post('https://dashing-llama-639318.netlify.app/.netlify/functions/getRssNews', { "url": "https://news.google.com/rss/search?q=technology&hl=en-IN&gl=IN&ceid=IN:en" }, { responseType: 'text' })
			.subscribe({
				next: xml => {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(xml.toString(), 'text/xml');
					const items = Array.from(xmlDoc.querySelectorAll('item'));

					this.highLights.update((item) => [...item, ...items.slice(0, 5).map((rss: any) => ({
						uid: '',
						isBirthdayHighlight: false,
						content: rss.querySelector('title')?.textContent,
						hasImage: true,
						imageLink: 'organization_logo/gnews.webp',
						link: rss.querySelector('link')?.textContent,
						rank: 3
					}))])
				}
			});


		// this.http.get<any>('https://api.spaceflightnewsapi.net/v4/articles/?limit=5').subscribe({
		// 	next: data => {
		// 		this.highLights.update((item) => [...item, ...data.results.map((item: any) => ({
		// 			uid: item.id,
		// 			isBirthdayHighlight: false,
		// 			content: item.title,
		// 			hasImage: true,
		// 			imageLink: item.image_url,
		// 			link: item.url,
		// 			rank: 4
		// 		}))])
		// 	}
		// });

		// this.http.get<any>('https://hacker-news.firebaseio.com/v0/topstories.json').subscribe({
		// 	next: data => {

		// 		for (let i = 0; i < 5; i++) {
		// 			this.http.get<any>(`https://hacker-news.firebaseio.com/v0/item/${data[i]}.json`).subscribe({
		// 				next: data1 => {
		// 					this.highLights.update((item) => [...item,
		// 					{
		// 						uid: data1.id,
		// 						isBirthdayHighlight: false,
		// 						content: `${data1.title} ${data1.text != undefined ? ' - ' + this.strip(data1.text) : ''}`,
		// 						hasImage: true,
		// 						imageLink: 'organization_logo/hacker_news.svg',
		// 						link: data1.url,
		// 						rank: 5
		// 					}
		// 					])
		// 				}
		// 			});
		// 		}
		// 	}
		// });
	}

	strip(html: string) {
		let doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || "";
	}

	ngAfterViewInit() {
		this.startProgressLoop();
	}

	ngOnDestroy() {
		this.stopProgressLoop();
	}


	private startProgressLoop() {
		const update = () => {
			const audio = this.audioPlayerRef.nativeElement;
			const progressBar = this.progressBarRef.nativeElement;

			if (!audio.paused && !audio.ended && !this.isUserSeeking) {
				const currentTime = audio.currentTime;
				this.currentSongTime.set(currentTime);
				progressBar.value = String(currentTime);
			}

			this.progressAnimationFrame = requestAnimationFrame(update);
		};
		this.progressAnimationFrame = requestAnimationFrame(update);
	}

	private stopProgressLoop() {
		if (this.progressAnimationFrame !== null) {
			cancelAnimationFrame(this.progressAnimationFrame);
			this.progressAnimationFrame = null;
		}
	}

	seekAudio(event: Event) {
		const audio = this.audioPlayerRef.nativeElement;
		const slider = event.target as HTMLInputElement;
		audio.currentTime = parseFloat(slider.value);
	}

	onSeekStart() { this.isUserSeeking = true; }
	onSeekEnd() { this.isUserSeeking = false; }

	onAudioEnded() {
		this.playerState.nextSong();
		setTimeout(() => this.playSong(), 50);
	}

	onAudioPaused() {
		this.playerState.pauseSong();
	}

	onAudioPlayed() {
		this.playerState.playSong();
	}


	previousSong() { this.playerState.previousSong(); setTimeout(() => this.playSong(), 50); }
	nextSong() { this.playerState.nextSong(); setTimeout(() => this.playSong(), 50); }

	pauseSong() {
		if (this.audioPlayerRef) {
			this.audioPlayerRef.nativeElement.pause();
			this.playerState.pauseSong();
		}
	}

	playSong() {
		if (this.audioPlayerRef) {
			this.audioPlayerRef.nativeElement.play().then(() => {
				this.RootScope.interaction.set(0);
				this.playerState.playSong();
			});
		}
	}

	toggleFullScreen() {
		const element: any = document.documentElement;
		if (this.isFullScreen()) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if ((document as any).mozCancelFullScreen) { // Firefox
				(document as any).mozCancelFullScreen();
			} else if ((document as any).webkitExitFullscreen) { // Chrome, Safari and Opera
				(document as any).webkitExitFullscreen();
			} else if ((document as any).msExitFullscreen) { // IE/Edge
				(document as any).msExitFullscreen();
			}
			this.isFullScreen.set(false);
		} else {
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) { // Firefox
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
				element.webkitRequestFullscreen();
			} else if (element.msRequestFullscreen) { // IE/Edge
				element.msRequestFullscreen();
			}
			this.isFullScreen.set(true);
		}
	}

	animationDone() {
		// The animation has completed, so we advance to the next highlight
		if (this.highLights().length > 1)
			this.currentHighlight.update(val => (val + 1) % this.highLights().length);
		this.isOpen.set(false);
		// Toggle isOpen to restart the animation for the next highlight
		setTimeout(() => {
			this.isOpen.set(true);
		}, 0); // Small delay to ensure the class is removed and re-added
	}

	ngOnInit() {
		this.isOpen.set(true);
	}

	openHighlight(highlight: Highlights) {
		if (highlight.isBirthdayHighlight) {
			let result = prompt("Please enter password before proceeding");
			this.http.post<any>('https://dashing-llama-639318.netlify.app/.netlify/functions/getBirthdays', {
				password: result
			}).subscribe({
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

	openLink(link: string) {
		window.open(link);
	}

}