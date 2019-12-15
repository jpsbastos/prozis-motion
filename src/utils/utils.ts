export class Utils {
    public static generateRandomValue(maxValue: number, minValue: number = 0): number {
        return Math.round(Math.random() * (maxValue - minValue) + minValue);
    }

    public static degreesToRadians(degrees: number) {
        return degrees * (Math.PI/180);
    }
}