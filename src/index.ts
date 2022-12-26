import BinaryConverter from './BinaryConverter';
import IntelligentBird, { binaryConverter } from './IntelligentBird';
import Renderer from './Renderer';
import SimulationRenderer from './SimulationRenderer';

const elem = document.getElementById('canvas');

if (!elem || !(elem instanceof HTMLCanvasElement)) throw new Error('No canvas');

const renderer = new SimulationRenderer(elem, {
    width: 50,
    speed: 2,
    spawnCoefficient: 10,
    birdGravity: 0.5,
    birdHeight: 10,
    birdWidth: 10,
    birdX: 100,
    jumpStrength: 8,
    initialY: elem.height / 2,
    openingSize: 100,
});
renderer.startSimulation(8);

// const b = new IntelligentBird(renderer.getOptions(), renderer);

// const binary = b.toBinary();
// console.log(b.getNetwork());

// console.log(binary);
// console.log(binaryConverter.parseBinary(binary.substring(0, 16)));
// console.log(
//     b.fromBinary(
//         binary,
//         b
//             .getNetwork()
//             .getWeights()
//             .map((e) => e.length),
//         b
//             .getNetwork()
//             .getBiases()
//             .map((e) => e.length)
//     )
// );

// renderer.start();
