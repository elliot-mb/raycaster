export default class Point{
    constructor(x, y, draggable){
        //this.position = {x: x, y: y};
        this.x = x;
        this.y = y;
        this.draggable = draggable;
        this.dragMargin = 10; //px
        this.radius = 10; //px
        this.dragging = false;
        this.offsetFromMouse = {x:0,y:0};
        this.visible = true;
    }  

    click(cursor){
        let dy = (cursor.y - this.y);
        let dx = (cursor.x - this.x);
        let distance = 
        Math.sqrt(dx*dx + dy*dy);
        if(distance <= this.radius+this.dragMargin && this.draggable){
            this.dragging = true;
            this.offsetFromMouse.x = dx;
            this.offsetFromMouse.y = dy;
        }
    }

    drag(cursor){
        this.x = cursor.x - this.offsetFromMouse.x; //retains its relative position to mouse from when it was clicked
        this.y = cursor.y - this.offsetFromMouse.y;
    }

    draw(ctx){
        if(this.visible && this.draggable){
            ctx.beginPath(); 
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fill(); 
        }
    }
}