import BinaryConverter from './BinaryConverter';
import Bird, { BirdOptions } from './Bird';
import NeuralNetwork from './neuralnet/NeuralNetwork';
import SimulationRenderer from './SimulationRenderer';

export const binaryConverter = new BinaryConverter(5, 10);

export default class IntelligentBird extends Bird {
    public constructor(
        options: BirdOptions,
        private simulation: SimulationRenderer,
        private network: NeuralNetwork = new NeuralNetwork([4, 5, 5, 2], {})
    ) {
        super(simulation, options);
    }

    runNeuralNet(data: number[]) {
        return this.network.computeNetwork(data);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // decide with runNeuralNet() here
        // TODO: collect data: distance (px) from next pipe, current height, current velocity, dist from center of next pipe
        let res = [1, 0];
        const nextPipe = this.simulation.getNextPipe();
        if (nextPipe) {
            const nextPipeDistance = nextPipe.getX() - nextPipe.getWidth() / 2 - this.getX() - this.getWidth();
            const distFromCenter = nextPipe.getOpeningY() - this.getY();
            const currentHeight = this.getY();
            const currentVelocity = this.getDy();

            res = this.runNeuralNet([nextPipeDistance, distFromCenter, currentHeight, currentVelocity]);
        }
        // [dontJump, jump];
        if (res[1] > res[0]) this.jump();
        super.render(ctx);
    }

    public _render(ctx: CanvasRenderingContext2D) {
        super.render(ctx);
    }

    public toBinary(): string {
        let binary = '';

        for (const w1 of this.network.getWeights()) {
            for (const w2 of w1) {
                binary += binaryConverter.toBinary(w2);
            }
        }

        for (const b1 of this.network.getBiases()) {
            for (const b2 of b1) {
                binary += binaryConverter.toBinary(b2);
            }
        }

        return binary;
    }

    public fromBinary(
        binary: string,
        weightsInfo: number[],
        biasesInfo: number[]
    ): { weights: number[][]; biases: number[][] } {
        const weights: number[][] = [];
        const biases: number[][] = [];
        const numberSize = binaryConverter.getBinaryLength();

        for (let i = 0; i < weightsInfo.length; i++) {
            const weightLayer = weightsInfo[i];
            const w = [];
            for (let j = 0; j < weightLayer; j++) {
                w.push(
                    binaryConverter.parseBinary(
                        binary.substring(0, numberSize)
                        // binary.substring((i + 1) * j * numberSize, (i + 1) * j * numberSize + numberSize)
                    )
                );
                binary = binary.substring(numberSize);
            }
            weights.push(w);
        }

        for (let i = 0; i < biasesInfo.length; i++) {
            const biasLayer = biasesInfo[i];
            const b = [];
            for (let j = 0; j < biasLayer; j++) {
                b.push(
                    binaryConverter.parseBinary(
                        binary.substring(0, numberSize)
                        // binary.substring((i + 1) * j * numberSize, (i + 1) * j * numberSize + numberSize)
                    )
                );
                binary = binary.substring(numberSize);
            }
            biases.push(b);
        }

        return { weights, biases };
    }

    public copy() {
        return new IntelligentBird(this.getOptions(), this.simulation, this.network.copy());
    }

    public copyAndMutate(): IntelligentBird {
        // TODO: do it
        const copy = this.copy();
        let binary = copy.toBinary();
        for (let i = 0; i < 5; i++) {
            let randIndex = Math.floor(Math.random() * binary.length);
            binary =
                binary.substring(0, randIndex) +
                (binary[randIndex] === '1' ? '0' : '1') +
                binary.substring(randIndex + 1);
        }
        const { weights, biases } = this.fromBinary(
            binary,
            copy
                .getNetwork()
                .getWeights()
                .map((e) => e.length),
            copy
                .getNetwork()
                .getBiases()
                .map((e) => e.length)
        );
        copy.getNetwork().setWeights(weights);
        copy.getNetwork().setBiases(biases);
        return copy;
    }

    public getNetwork() {
        return this.network;
    }
}
