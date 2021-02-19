import LineSegment from "/src/line.js";

export default class Ray extends LineSegment{
    constructor(position, endpoint, id){
        super(position, endpoint); //calculation origin and endpoint
        this.intersectionP;
        this.drawnOrigin = [0,0]; //rendering origin and endpoint
        this.width = 2;
        this.id = id;
    }

    drawLine(ctx){
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        if(this.intersectionP){ctx.lineTo(this.intersectionP[0], this.intersectionP[1]);}
        else{ctx.lineTo(this.end.x, this.end.y);}
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = this.width;
        ctx.stroke();
        //if(this.intersectionP == undefined){console.log(`im not intersecting, im ray ${this.id}`);}
    }
}