import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
	selector: 'app-linear-equilibrium',
	imports: [],
	templateUrl: './linear-equilibrium.html',
	styleUrl: './linear-equilibrium.scss'
})
export class LinearEquilibrium implements AfterViewInit{
	@ViewChild('myCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

	width = 600;
	height = 600;
	color = '#FFFFFF';
	i = 6;
	first = signal(true);
	ctx!: CanvasRenderingContext2D;


	ngAfterViewInit() {
		this.nextStep();
	}

	private generatePoints(n: number): [number, number][] {
		const points: [number, number][] = [];
		const d = (2 * Math.PI) / n;
		for (let i = 0; i < n; i++) {
			const x = this.width / 2 + (this.width / 2 - 20) * Math.cos(d * i);
			const y = this.height / 2 + (this.height / 2 - 20) * Math.sin(d * i);
			points.push([x, y]);
		}
		return points;
	}

	private animateLineDrawing(x1: number, y1: number, x2: number, y2: number): Promise<void> {
		return new Promise((resolve) => {
			const ctx = this.ctx;
			const duration = 1000;
			const start = performance.now();

			const animate = (currentTime: number) => {
				let progress = (currentTime - start) / duration;
				if (progress > 1) progress = 1;
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress);
				ctx.stroke();
				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					ctx.closePath();
					resolve();
				}
			};
			requestAnimationFrame(animate);
		});
	}

	private drawLines(points: [number, number][]): Promise<void> {
		return new Promise(async (resolve) => {
			const canvas = this.canvasRef?.nativeElement;
			this.ctx = canvas.getContext('2d')!;
			this.ctx.lineWidth = 1.5;
			this.ctx.strokeStyle = this.color;

			for (let i = 0; i < points.length; i++) {
				for (let j = i + 1; j < points.length; j++) {
					await this.animateLineDrawing(points[i][0], points[i][1], points[j][0], points[j][1]);
					if (i === points.length - 2 && j === points.length - 1) {
						setTimeout(() => {
							this.ctx.clearRect(0, 0, this.width, this.height);
							resolve();
						}, 3000);
					}
				}
			}
		});
	}

	private async vectorEquilibrium(n: number) {
		const points = this.generatePoints(n);
		await this.drawLines(points);
		this.nextStep();
	}

	private nextStep() {
		if (this.i === 27) {
			this.i = 6;
		}

		if (this.first()) {
			setTimeout(() => {
				this.first.set(false);
				setTimeout(() => this.nextStep(), 1000);
			}, 4000);
		} else {
			this.vectorEquilibrium(this.i++);
		}
	}
}
