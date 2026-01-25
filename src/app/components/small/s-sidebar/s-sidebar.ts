import { Component, computed, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StateService } from '../../../services/state-service';
import { DecimalPipe, NgStyle, NgClass } from '@angular/common';
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
	isLightMode = signal<boolean>(false);
	@ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
	@ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>;

	currentSongTime = signal<number>(0);

	private progressAnimationFrame: number | null = null;
	private isUserSeeking = false;

	constructor(public playerState: MusicPlayer, public RootScope: StateService, private http: HttpClient, private router : Router) {
		effect(() => {
			if (this.RootScope.interaction() != 0) {
				this.playSong();
			}
		});
	}

	strip(html: string) {
		let doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || "";
	}

	toggleMode(){
		
	}

	ngOnInit() {
		this.isOpen.set(true);
		this.http.post<any>('https://dashing-llama-639318.netlify.app/.netlify/functions/getBirthdays', { "password": "" }).subscribe({
			next: (data: any) => {
				this.RootScope.highLights.update((item) => [...item, ...data.map((item: any) => ({
					uid: '',
					isBirthdayHighlight: true,
					content: `🥳🎉 ${item.message}`,
					imageLink: '',
					bigBanner: '',
					description: '',
					hasImage: false,
					link: '',
					publishedTime: '',
					source: '',
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

					this.RootScope.highLights.update((item) => [...item, ...items.slice(0, 5).map((rss: any) => ({
						uid: '',
						isBirthdayHighlight: false,
						content: rss.querySelector('title')?.textContent,
						hasImage: true,
						description: rss.querySelector('description')?.textContent,
						imageLink: rss.getElementsByTagName('media:content')[0].getAttribute("url"),
						bigBanner: rss.getElementsByTagName('media:content')[2].getAttribute("url"),
						publishedTime: rss.querySelector('pubDate')?.textContent,
						source: 'www.theguardian.com',
						link: rss.querySelector('link')?.textContent,
						rank: 2,
						w: 0
					}))])
				}
			});

		this.http.post('https://dashing-llama-639318.netlify.app/.netlify/functions/getRssNews', { "url": "https://news.google.com/rss/search?q=technology&hl=en-IN&gl=IN&ceid=IN:en" }, { responseType: 'text' })
			.subscribe({
				next: xml => {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(xml.toString(), 'text/xml');
					const items = Array.from(xmlDoc.querySelectorAll('item'));

					this.RootScope.highLights.update((item) => [...item, ...items.slice(0, 5).map((rss: any) => ({
						uid: '',
						isBirthdayHighlight: false,
						content: rss.querySelector('title')?.textContent,
						description: rss.querySelector('description')?.textContent,
						hasImage: true,
						imageLink: '/artifact/google.svg',
						bigBanner: '',
						publishedTime: rss.querySelector('pubDate')?.textContent,
						source: 'news.google.com',
						link: rss.querySelector('link')?.textContent,
						rank: 3,
						w: 0
					}))])
				}
			});


		this.http.get<any>('https://api.spaceflightnewsapi.net/v4/articles/?limit=5').subscribe({
			next: data => {
				this.RootScope.highLights.update((item) => [...item, ...data.results.map((item: any) => ({
					uid: item.id,
					isBirthdayHighlight: false,
					content: item.title,
					hasImage: true,
					bigBanner: item.image_url,
					publishedTime: item.updated_at,
					source: 'api.spaceflightnewsapi.net',
					description: item.summary,
					imageLink: item.image_url,
					link: item.url,
					rank: 4,
				}))])
			}
		});

		this.http.get<any>('https://hacker-news.firebaseio.com/v0/topstories.json').subscribe({
			next: data => {

				for (let i = 0; i < 5; i++) {
					this.http.get<any>(`https://hacker-news.firebaseio.com/v0/item/${data[i]}.json`).subscribe({
						next: data1 => {
							this.RootScope.highLights.update((item) => [...item,
							{
								uid: data1.id,
								isBirthdayHighlight: false,
								content: `${data1.title} ${data1.text != undefined ? ' - ' + this.strip(data1.text) : ''}`,
								hasImage: true,
								bigBanner: '',
								publishedTime: data1.time,
								source: 'hacker-news.firebaseio.com',
								description: '',
								imageLink: 'organization_logo/hacker_news.svg',
								link: data1.url,
								rank: 5,
								w: 0
							}
							])
						}
					});
				}
			}
		});
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
		if (this.RootScope.highLights().length > 1)
			this.currentHighlight.update(val => (val + 1) % this.RootScope.highLights().length);
		this.isOpen.set(false);
		// Toggle isOpen to restart the animation for the next highlight
		setTimeout(() => {
			this.isOpen.set(true);
		}, 0); // Small delay to ensure the class is removed and re-added
	}

	openHighlight(highlight: Highlights) {
		if(highlight.isBirthdayHighlight) {
			this.router.navigate(['/updates']);
		}
		else{
			this.openLink(highlight.link);
		}
	}

	openLink(link: string) {
		window.open(link);
	}

}