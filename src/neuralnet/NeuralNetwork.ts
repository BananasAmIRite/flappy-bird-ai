export interface NeuralNetworkOptions {
    weightsRandomize?: () => number;
    biasRandomize?: () => number;
}

export default class NeuralNetwork {
    private weights: number[][] = [];
    private biases: number[][] = [];

    private options: NeuralNetworkOptions;
    public constructor(layers: number[], options: NeuralNetworkOptions) {
        this.options = options;
        for (let i = 0; i < layers.length; i++) {
            const layerSize = layers[i];
            const nextLayerSize = layers[i + 1];
            const biases = [];
            const weights = [];
            for (let j = 0; j < layerSize; j++) {
                biases.push((options.weightsRandomize || Math.random)());
                for (let k = 0; k < nextLayerSize; k++) {
                    weights.push((options.biasRandomize || Math.random)());
                }
            }
            this.biases.push(biases);
            if (i !== layers.length - 1) this.weights.push(weights);
        }
    }

    public setBiases(biases: number[][]) {
        this.biases = biases;
    }

    public setWeights(weights: number[][]) {
        this.weights = weights;
    }

    public getBiases() {
        return this.biases;
    }

    public getWeights() {
        return this.weights;
    }

    // TODO: rewatch 3b1b cuz this may be wrong
    public computeNetwork(inputs: number[]) {
        let lastComputed = inputs;
        for (let i = 1; i < this.biases.length; i++) {
            const computed = [];
            for (let j = 0; j < this.biases[i].length; j++) {
                let sum = 0;
                for (let k = 0; k < this.biases[i - 1].length; k++) {
                    let weight = this.weights[i - 1][j * this.biases[i - 1].length + k];
                    sum += lastComputed[k] * weight;
                }
                computed.push(sum + this.biases[i][j]);
            }
            lastComputed = computed;
        }

        return lastComputed;
    }

    public copy(): NeuralNetwork {
        const nw = new NeuralNetwork([], this.options);
        const newBiases: number[][] = [];
        for (let i = 0; i < this.biases.length; i++) {
            newBiases.push([]);
            for (let j = 0; j < this.biases[i].length; j++) {
                newBiases[i][j] = this.biases[i][j];
            }
        }

        const newWeights: number[][] = [];
        for (let i = 0; i < this.weights.length; i++) {
            newWeights.push([]);
            for (let j = 0; j < this.weights[i].length; j++) {
                newWeights[i][j] = this.weights[i][j];
            }
        }
        nw.setBiases(newBiases);
        nw.setWeights(newWeights);
        return nw;
    }
}
