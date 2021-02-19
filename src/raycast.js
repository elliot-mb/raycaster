import Ray from "/src/ray.js";

export default class Raycast{
    constructor(x,y){
        this.rays = [];
        this.rayCoords = [];
        this.position = {x: x, y: y};
        this.instance = 1000;
        this.radius = 3000;
        this.offset = 0.7854;//0.7854; //offset for all generated rays, which circumvents the issue i had where sometimes the first ray generated would phase through walls for some reason
        //this.closestP = [];
        this.points = [];
        this.renderState = 0;
        this.modRenderState;
    }

    generateRays(){ //generates rays radially around a point
        this.rays = [];
        this.rayCoords = [];
        for(let i=0; i < this.instance; i++){
            let interval = 6.2832/this.instance; //interval is the amount of radians turned per ray cast
            let theta = (interval*i)+this.offset;
            let endPoint = {
                x: Math.cos(theta)*this.radius, //generates a circle of points for the ends of the line segments
                y: Math.sin(theta)*this.radius
            };
            this.rayCoords.push(endPoint);
            this.rays.push(new Ray({x: 0, y: 0}, {x: 0, y: 0}, i));
            //console.log(this.rays[i]);
        }
    }

    intersect(scene){ //calculate intersections with scene
        this.points = [], scene.previousPoint = undefined, scene.currentLine = -1; //previous point must be set to undefined else we get a residual point when theres a segment change
        this.rays.forEach(ray =>{
            ray.intersectionP = scene.update(ray, this.points);
        });
        //console.log('check done');
    }

    update(){
        for(let i=0; i < this.rayCoords.length; i++){ //updates the origin of each ray
            this.rays[i].start = {x: this.position.x, y: this.position.y};
            this.rays[i].end = {x: this.rayCoords[i].x+this.position.x, y: this.rayCoords[i].y+this.position.y};
             //endpoint of non-intersecting rays
        }
    }

    draw(ctx){
        //this.rays.forEach(ray =>{ 
            //ray.drawLine(ctx);
        //});
        this.modRenderState = this.renderState%4;
        switch(this.modRenderState){ //render states
            case 0:
                this.rays.forEach(ray =>{ 
                    ray.drawLine(ctx);
                });
                console.log('just the rays');
                break;
            case 1:
                this.drawOutline(ctx);
                console.log('just the outline');
                break;
            case 2:
                this.rays.forEach(ray =>{ 
                    ray.drawLine(ctx);
                });
                this.drawOutline(ctx);
                console.log('rays and outline');
                break;
            case 3:
                this.drawFilled(ctx);
                console.log('filled');
                break;
            default:
                break;
        }
    }

    drawOutline(ctx){
        if(this.rays[this.rays.length-1].intersectionP){this.points.push([this.rays[this.rays.length-1].intersectionP[0],this.rays[this.rays.length-1].intersectionP[1]]);} //bridges the gap between sweeps that causes loss of previousPoint
        ctx.beginPath();
        for(let i = 0; i < this.points.length; i++){
            if(this.points[i]){ctx.lineTo(this.points[i][0], this.points[i][1]);}
            if(i > this.rays.length){i = this.this.points.length;}
        }
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 6;
        ctx.stroke();
    }

    drawFilled(ctx){
        if(this.rays[this.rays.length-1].intersectionP){this.points.push([this.rays[this.rays.length-1].intersectionP[0],this.rays[this.rays.length-1].intersectionP[1]]);} //bridges the gap between sweeps that causes loss of previousPoint
        ctx.beginPath();
        for(let i = 0; i < this.points.length; i++){
            if(this.points[i]){ctx.lineTo(this.points[i][0], this.points[i][1]);}
        }
        ctx.closePath();
        ctx.fillStyle = '#999999';
        ctx.fill();
    }
}

//the drawnOrigin and drawnEndpoing of each ray update 2 frames after the actual position and actual endpoint update
//this gives the program a frame to get the intersection calculation correct and convert any previously-non intersecting lines
//to intersecting lines. this does mean its slightly less responsive ()

//TURNS OUT I DONT NEED ANY OF THAT!! i just needed to do the distance calculation in the intersection calc
//and that synced everything and made it act fast enough by getting rid of a nested for loop and an array
//that everything works perfectly now on actual position!!!
//this optimisation had a domino effect, so now the code is more efficient and the raycast updates every frame, rather than 2 frames
//after each position update! woo! responsive! efficient! (more formal explanation in changelog)

//for polycasting you could check the segment each ray intersects with, then see which of the two points on that segment are furthest from each other 
//determining this means i could draw a polygon with verticies as the generated pairs