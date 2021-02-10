import LineSegment from "/src/line.js";
import Ray from "/src/ray.js";

export default class Raycast{
    constructor(x,y){
        this.rays = [];
        this.rayCoords = [];
        this.position = {x: x, y: y};
        this.instance = 500;
        this.radius = 2000;
        //this.closestP = [];
    }

    generateRays(){ //generates rays radially around a point
        for(let i=0; i < this.instance; i++){
            let interval = 6.2832/this.instance; //interval is the amount of radians turned per ray cast
            let theta = interval*i;
            let endPoint = {
                x: Math.sin(theta)*this.radius, //generates a circle of points for the ends of the line segments
                y: Math.cos(theta)*this.radius
            };
            this.rayCoords.push(endPoint);
            this.rays.push(new Ray({x: 0, y: 0}, {x: 0, y: 0}));
        }
    }

    intersect(scene){ //calculate intersections with scene
        scene.intersections = [];
        this.rays.forEach(ray =>{
            ray.intersections = scene.update(ray);
        });
    }

    update(){
        /*this.rays.forEach(ray =>{
            ray.start = {x: this.position.x, y: this.position.y};
            ray.end = 
        });*/
        for(let i=0; i < this.rayCoords.length; i++){ //updates the origin of each ray
            this.rays[i].start = {x: this.position.x, y: this.position.y};

            let closestP;
            let distance; 
            let temp = 100000; //big number to find a point closer than it
            let dx;
            let dy;
            this.rays[i].intersections.forEach(point =>{ //works out each intersection point and its distance from the ray's origin
                //dx = point[0]-this.position.x; //used to update rays on actual position, but since the new position takes some frames to draw, this can create
                //dy = point[1]-this.position.y; //mistakes as lines are drawn through a wall which is closer to actual position, just not drawn position
                dx = point[0]-this.rays[i].drawnOrigin.x; 
                dy = point[1]-this.rays[i].drawnOrigin.y; //does distance caclulation from drawn position so as to not draw through walls when moving really fast
                distance = Math.sqrt(dx*dx + dy*dy); //pythag
                if(distance < temp){
                    temp = distance;
                    closestP = point; //chooses the closest one
                }
            });
            this.rays[i].intersectionP = closestP; //set closest point to intersection point
            this.rays[i].end = {x: this.rayCoords[i].x+this.position.x, y: this.rayCoords[i].y+this.position.y};
             //endpoint of non-intersecting rays
        }
    }

    draw(ctx){
        let i = 0
        this.rays.forEach(ray =>{ 
            ray.drawLine(ctx);  
            ray.drawnOrigin = {x: this.position.x, y: this.position.y}; //these make the lines render in the right place, they update the line visual in the frame after its moved, and thus done the position calcualation
            ray.drawnEndpoint = {x: this.rayCoords[i].x+this.position.x, y: this.rayCoords[i].y+this.position.y};
            i++;
        });
        
    }
}

//the drawnOrigin and drawnEndpoing of each ray update 2 frames after the actual position and actual endpoint update
//this gives the program a frame to get the intersection calculation correct and convert any previously-non intersecting lines
//to intersecting lines. this does mean its slightly less responsive ()