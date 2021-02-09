import LineSegment from "/src/line.js";

export default class Ray extends LineSegment{
    constructor(position, endpoint){
        super(position, endpoint);
        this.intersections = [];
        this.intersectionP;
    }

    drawIntersectingLine(ctx){
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.intersectionP[0], this.intersectionP[1]);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.width;
        ctx.stroke(); 
    }
}