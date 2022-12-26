import Entity from './Entity';
import Pipe from './Pipe';
import Renderer from './Renderer';

export interface BirdOptions {
    birdX: number;
    birdWidth: number;
    birdHeight: number;
    jumpStrength: number;
    initialY: number;
    birdGravity: number;
}

export default class Bird implements Entity {
    private y: number = 0;
    private dy: number = 0;
    private currentPipe: Pipe | null = null;

    private score: number = 0;

    private sumDistances = 0;
    private color: string = 'red';

    constructor(private renderer: Renderer, private options: BirdOptions) {
        // window.addEventListener('keypress', (e) => {
        //     e.preventDefault();
        //     this.dy = this.options.jumpStrength;
        // });
        this.reset();
    }

    public reset() {
        this.y = this.options.initialY;
        this.dy = 0;
        this.score = 0;
        this.sumDistances = 0;
    }

    public jump() {
        this.dy = this.dy = this.options.jumpStrength;
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.dy -= this.options.birdGravity;
        this.y -= this.dy;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());

        if (this.renderer.isBirdColliding(this) || this.getY() < 0 || this.getY() > this.getRenderer().getHeight()) {
            this.renderer.removeBird(this);
        }

        const p = this.renderer.getInsidePipe(this);
        if (p && this.currentPipe !== p) {
            this.score++;
            console.log('inc score: ' + this.score);
            this.currentPipe = p;
            const dist = Math.abs(p.getOpeningY() - this.getY());
            this.sumDistances += dist;
            // this.avgDistFromCenter = (this.avgDistFromCenter * (this.score - 1) + dist) / this.score;
        }
    }

    public getOptions() {
        return this.options;
    }

    public getRenderer() {
        return this.renderer;
    }

    public getX() {
        return this.options.birdX;
    }

    public getY() {
        return this.y;
    }

    public getDy() {
        return this.dy;
    }

    public getWidth() {
        return this.options.birdWidth;
    }

    public getHeight() {
        return this.options.birdHeight;
    }

    public getScore() {
        return this.score;
    }

    public setColor(clr: string) {
        this.color = clr;
    }

    public getAvgDist() {
        return isNaN(this.sumDistances / this.score) ? 1024 : this.sumDistances / this.score;
    }
}
