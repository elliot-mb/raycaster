import LineSegment from "/src/line.js";

export default class Ray extends LineSegment{
    constructor(position, endpoint){
        super(position, endpoint); //calculation origin and endpoint
        this.intersections = [];
        this.intersectionP;
        this.drawnOrigin; //rendering origin and endpoint
        this.drawnEndpoint;
        this.drawnIntersection;
        this.width = 1;
    }

    drawLine(ctx){
        ctx.beginPath();
        if(this.drawnOrigin){ctx.moveTo(this.drawnOrigin.x, this.drawnOrigin.y);}
        if(this.intersectionP){ctx.lineTo(this.intersectionP[0], this.intersectionP[1]);}
        else if(this.drawnEndpoint){ctx.lineTo(this.drawnEndpoint.x, this.drawnEndpoint.y);}
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = this.width;
        ctx.stroke();
    }
}