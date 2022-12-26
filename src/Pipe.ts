import Bird from './Bird';
import Entity from './Entity';
import Renderer from './Renderer';

export interface PipeOptions {
    openingSize: number;
    openingHeight: number; // top
    width: number;
    speed: number;
    spawnCoefficient: number;
}

export default class Pipe implements Entity {
    private x: number;

    constructor(private renderer: Renderer, private options: PipeOptions, initialX: number) {
        this.x = initialX;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.x -= this.options.speed;

        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, 0, this.options.width, this.options.openingHeight);
        ctx.fillRect(
            this.x,
            this.options.openingHeight + this.options.openingSize,
            this.options.width,
            ctx.canvas.height - (this.options.openingHeight + this.options.openingSize)
        );

        if (this.isOffScreen()) this.renderer.addPipeToRemove(this);
    }

    isCollidingWithBird(bird: Bird) {
        return (
            (bird.getX() < this.x + this.options.width &&
                bird.getX() + bird.getWidth() > this.x &&
                bird.getY() < this.options.openingHeight &&
                bird.getHeight() + bird.getY() > 0) ||
            (bird.getX() < this.x + this.options.width &&
                bird.getX() + bird.getWidth() > this.x &&
                bird.getY() <
                    this.options.openingHeight +
                        this.options.openingSize +
                        this.renderer.getHeight() -
                        (this.options.openingHeight + this.options.openingSize) &&
                bird.getHeight() + bird.getY() > this.options.openingHeight + this.options.openingSize)
        );
    }

    public isInsidePipe(bird: Bird) {
        return (
            (bird.getX() - bird.getWidth() / 2 - (this.x - this.getWidth() / 2) >= 0 &&
                bird.getX() - bird.getWidth() / 2 - (this.x - this.getWidth() / 2) <= this.getWidth()) ||
            (this.x + this.getWidth() / 2 - (bird.getX() + bird.getWidth() / 2) >= 0 &&
                this.x + this.getWidth() / 2 - (bird.getX() + bird.getWidth() / 2) <= this.getWidth())
        );
    }

    isOffScreen() {
        return this.getX() + this.getWidth() <= 0;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.options.openingHeight;
    }

    getOpeningY(): number {
        return this.options.openingHeight + this.options.openingSize / 2;
    }

    getWidth(): number {
        return this.options.width;
    }
    getHeight(): number {
        return this.renderer.getHeight();
    }
}
