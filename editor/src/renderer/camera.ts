export class Camera {
    public x = 100;
    public y = 100;


    transX(x: number) {
        return x - this.x;
    }

    transY(y: number) {
        return y - this.y;
    }

    reverseX(x: number) {
        return x + this.x;
    }

    reverseY(y: number) {
        return y + this.y;
    }
}