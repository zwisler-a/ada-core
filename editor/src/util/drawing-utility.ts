export function connect(ctx, start: { x: number, y: number }, end: { x: number, y: number }) {
    const distanceX = end.x - start.x;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + distanceX / 2, start.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start.x + distanceX / 2, start.y);
    ctx.lineTo(start.x + distanceX / 2, end.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start.x + distanceX / 2, end.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}