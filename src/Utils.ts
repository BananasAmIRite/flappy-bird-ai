export default class Utils {
    static padZeros(binary: string, length: number) {
        return '0'.repeat(length - binary.length) + binary;
    }
}
