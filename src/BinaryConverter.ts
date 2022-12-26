import Utils from './Utils';

export default class BinaryConverter {
    POWER_MAX = 5; // 2^2 - 1 -> 3
    SIG_MAX = 10; // 2^10 - 1

    public constructor(powMax = 5, sigMax = 10) {
        this.POWER_MAX = powMax;
        this.SIG_MAX = sigMax;
    }

    toBinary(n: number) {
        let str = Math.abs(n).toString();
        if (str[0] === '0' && str[1] === '.') str = str.slice(1);
        const roundTo = Math.min(
            Math.min(2 ** this.POWER_MAX - 1, str.replaceAll('.', '').length),
            Math.floor(Math.log10(2 ** this.SIG_MAX))
        );
        const power = roundTo - (str.indexOf('.') === -1 ? roundTo : str.indexOf('.'));
        if (power < 0) throw new Error(`Number, ${n}, has too many sigfigs to convert`);
        const rounded = Math.round(Math.abs(n) * 10 ** power) / 10 ** power; // round the number to the correct decimal places
        const mantissa = Math.round(rounded * 10 ** power); // get the number without any decimals
        return (
            (Math.sign(n) > 0 ? '0' : '1') +
            Utils.padZeros(power.toString(2), this.POWER_MAX) +
            Utils.padZeros(mantissa.toString(2), this.SIG_MAX)
        );
    }

    parseBinary(n: string) {
        const sign = n[0] === '1' ? -1 : 1;
        const power = parseInt(n.slice(1, this.POWER_MAX + 1), 2);
        const data = parseInt(n.slice(this.POWER_MAX + 1), 2);
        return sign * data * 10 ** -power;
    }

    getBinaryLength() {
        return this.POWER_MAX + this.SIG_MAX + 1;
    }
}
