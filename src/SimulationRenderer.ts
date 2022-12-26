import IntelligentBird from './IntelligentBird';
import Renderer from './Renderer';

interface BirdPerformanceStats {
    bird: IntelligentBird;
    framesAlive: number;
    distFromCenterOfPipe: number;
    score: number;
}

export default class SimulationRenderer extends Renderer {
    private generation: number = 0;
    private bestScore: number = 0;
    private performanceStats: BirdPerformanceStats[] = [];

    private framesElapsed = 0;

    public startSimulation(pop: number) {
        this.generation = 0;
        this.start();
        this.startGeneration(this.getNewGeneration(pop));
    }

    public startGeneration(birds: IntelligentBird[]) {
        this.removeAllPipes();
        this.startPipeSpawn();
        this.generation++;
        this.framesElapsed = 0;
        console.log(`Generation: ${this.generation}`);

        this.addBirds(birds);
    }

    public render(): void {
        super.render();
        this.framesElapsed++;
    }

    public override removeBird(bird: IntelligentBird): void {
        super.removeBird(bird);
        this.performanceStats.push({
            bird,
            framesAlive: this.framesElapsed,
            distFromCenterOfPipe: bird.getAvgDist(),
            // (this.getNextPipe()?.getOpeningY() || 0) - bird.getY(),
            score: bird.getScore(),
        });
        const v = Math.abs((this.getNextPipe()?.getOpeningY() || 0) - bird.getY());
        if (this.getBirds().length === 0) {
            const b = this.getBestBird(this.performanceStats);
            console.log('best bird score: ' + b.getScore());
            if (b.getScore() > this.bestScore) console.log(`New best score: ${b.getScore()}`);
            this.bestScore = Math.max(this.bestScore, b.getScore());
            this.startGeneration(this.getNextGeneration());
        }
    }

    private addBirds(birds: IntelligentBird[]) {
        for (const b of birds) {
            this.addBird(b);
        }
    }

    public getNewGeneration(size: number): IntelligentBird[] {
        const birds = [];
        for (let i = 0; i < size; i++) {
            birds.push(new IntelligentBird(this.getOptions(), this));
        }
        return birds;
    }

    private getBestBird(stats: BirdPerformanceStats[]): IntelligentBird {
        const bestPerf = stats.sort(
            (a, b) =>
                Math.abs(b.framesAlive - b.distFromCenterOfPipe) - Math.abs(a.framesAlive - a.distFromCenterOfPipe)
        );

        return bestPerf[0].bird;
    }

    private getNextGeneration(): IntelligentBird[] {
        const bestBird = this.getBestBird(this.performanceStats);
        // TODO: spawn a random generation of birds with similar weights and biases
        const newBirds: IntelligentBird[] = [];
        for (let i = 0; i < this.performanceStats.length - 1; i++) {
            newBirds.push(bestBird.copyAndMutate());
        }
        bestBird.reset();
        newBirds.push(bestBird);
        this.performanceStats = [];
        return newBirds;
    }
}
