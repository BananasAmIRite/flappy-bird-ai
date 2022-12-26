import Bird, { BirdOptions } from './Bird';
import Pipe, { PipeOptions } from './Pipe';

export interface RendererOptions extends Omit<PipeOptions, 'openingHeight'>, BirdOptions {}

export default class Renderer {
    private width: number;
    private height: number;

    private pipes: Pipe[];

    private pipesToRemove: Pipe[] = [];

    private birds: Bird[];

    constructor(private renderingElement: HTMLCanvasElement, private options: RendererOptions) {
        this.width = renderingElement.width;
        this.height = renderingElement.height;

        this.pipes = [];
        this.birds = [];

        this.startPipeSpawn();

        // this.birds.push(
        //     new Bird(this, {
        //         ...this.options,
        //     })
        // );
    }

    start() {
        this.render();
    }

    startPipeSpawn() {
        this.spawnPipes(4, 250);
    }

    removeAllPipes() {
        this.pipes = [];
    }

    render() {
        for (const p of this.pipesToRemove) {
            this.removePipe(p);
        }
        this.pipesToRemove = [];

        const ctx = this.renderingElement.getContext('2d');

        if (!ctx) throw new Error('No context provided');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (const e of this.pipes) {
            e.render(ctx);
        }

        for (const b of this.birds) {
            b.render(ctx);
        }

        window.requestAnimationFrame(() => this.render());
        // setTimeout(() => this.render(), 1);
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getPipes() {
        return this.pipes;
    }

    public getBirds() {
        return this.birds;
    }

    public addBird(bird: Bird) {
        this.birds.push(bird);
    }

    public removeBird(bird: Bird) {
        const i = this.birds.indexOf(bird);
        if (i >= 0) this.birds.splice(i, 1);
    }

    public removePipe(pipe: Pipe) {
        const i = this.pipes.indexOf(pipe);
        if (i >= 0) this.pipes.splice(i, 1);

        this.spawnPipe(this.width);
    }

    public addPipeToRemove(pipe: Pipe) {
        this.pipesToRemove.push(pipe);
    }

    public spawnPipes(amount: number, dist: number) {
        for (let i = 0; i < amount; i++) {
            this.spawnPipe(this.width + i * dist);
        }
    }

    public isBirdColliding(bird: Bird) {
        for (const p of this.pipes) {
            if (p.isCollidingWithBird(bird)) return true;
        }
        return false;
    }

    public getInsidePipe(bird: Bird): Pipe | null {
        for (const p of this.pipes) {
            if (p.isInsidePipe(bird)) return p;
        }
        return null;
    }

    public spawnPipe(x: number) {
        this.pipes.push(
            new Pipe(
                this,
                {
                    ...this.options,
                    openingHeight:
                        Math.random() * (this.height - 2 * (this.options.openingSize + 20)) +
                        this.options.openingSize +
                        20,
                    openingSize: this.options.openingSize,
                },
                x
            )
        );
    }

    public getNextPipe(): Pipe | null {
        for (const pipe of this.pipes) {
            if (pipe.getX() + pipe.getWidth() > this.options.birdX) return pipe;
        }
        return null;
    }

    public getOptions() {
        return this.options;
    }

    public getCanvas() {
        return this.renderingElement;
    }
}
