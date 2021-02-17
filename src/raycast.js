import LineSegment from "/src/line.js";
import Ray from "/src/ray.js";

export default class Raycast{
    constructor(x,y){
        this.rays = [];
        this.rayCoords = [];
        this.position = {x: x, y: y};
        this.instance = 500;
        this.radius = 3000;
        this.offset = 0.7854;//0.7854; //offset for all generated rays, which circumvents the issue i had where sometimes the first ray generated would phase through walls for some reason
        //this.closestP = [];
    }

    generateRays(){ //generates rays radially around a point
        for(let i=0; i < this.instance; i++){
            let interval = 6.2832/this.instance; //interval is the amount of radians turned per ray cast
            let theta = (interval*i)+this.offset;
            let endPoint = {
                x: Math.cos(theta)*this.radius, //generates a circle of points for the ends of the line segments
                y: Math.sin(theta)*this.radius
            };
            this.rayCoords.push(endPoint);
            this.rays.push(new Ray({x: 0, y: 0}, {x: 0, y: 0}, i));
            console.log(this.rays[i]);
        }
    }

    intersect(scene){ //calculate intersections with scene
        this.rays.forEach(ray =>{
            ray.intersectionP = scene.update(ray);
        });
        this.rays[0].intersectionP = scene.update(this.rays[0]);
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
        this.rays.forEach(ray =>{ 
            ray.drawLine(ctx);
        });
        
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