import LineSegment from "/src/line.js";

export default class Ray extends LineSegment{
    constructor(position, endpoint){
        super(position, endpoint); //calculation origin and endpoint
        this.intersectionP;
        this.drawnOrigin = [0,0]; //rendering origin and endpoint
        this.width = 1;
        //this.isIntersecting;
    }

    drawLine(ctx){
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        if(this.intersectionP){ctx.lineTo(this.intersectionP[0], this.intersectionP[1]);}
        else{ctx.lineTo(this.end.x, this.end.y);}
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.width;
        ctx.stroke();
    }
}