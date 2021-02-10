export default class LineSegment{
    constructor(point1, point2){
        this.start = point1;
        this.end = point2;
        this.width = 4;
        this.visible = true
        this.A, this.B, this.C;
    }
    initialise(){ //scruffy way of getting round bad horizontal/vertical behavior (simple logic => better performance)
        if(this.A == 0){
            this.start.y += 0.01;
        }
        if(this.B == 0){
            this.start.x += 0.01;
        }
    }

    update(){
        this.A = this.end.y - this.start.y;
        this.B = this.start.x - this.end.x;
        this.C = this.A*this.start.x + this.B*this.start.y;
    }

    draw(ctx){
        this.drawLine(ctx);
        this.drawPoints(ctx);
    }
    
    drawPoints(ctx){
        this.start.draw(ctx);
        this.end.draw(ctx);
    }

    drawLine(ctx){
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = '#90c2df';
        ctx.lineWidth = this.width;
        ctx.stroke(); 
    }
}