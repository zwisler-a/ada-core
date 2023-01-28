import {Camera} from "./camera";

export class RasterRenderer {

    constructor(private ctx: CanvasRenderingContext2D) {
    }

    render(camera: Camera) {
        const rectWidth = 30;
        const rectHeight = 30;
        const frameWidth = window.innerWidth * 20;
        const frameHeight = window.innerHeight * 20;

        this.ctx.strokeStyle = "rgba(0,0,0,0.08)";
        this.ctx.lineWidth = 1;

        for (let x = -(window.innerHeight * 10); x <= frameWidth; x += rectWidth) { // Drawing all vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(camera.transX(x), camera.transY(-(window.innerHeight * 10)));
            this.ctx.lineTo(camera.transX(x), camera.transY(frameHeight));
            this.ctx.stroke();
        }

        for (let y = -(window.innerWidth * 10); y <= frameHeight; y += rectHeight) { // Drawing all horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(camera.transX(-(window.innerWidth * 10)), camera.transY(y));
            this.ctx.lineTo(camera.transX(frameWidth), camera.transY(y));
            this.ctx.stroke();
        }
    }


}
