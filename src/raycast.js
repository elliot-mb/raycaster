import LineSegment from "/src/line.js";
import Ray from "/src/ray.js";

export default class Raycast{
    constructor(x,y){
        this.rays = [];
        this.rayCoords = [];
        this.position = {x: x, y: y};
        this.instance = 1000;
        this.radius = 4000;
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
        scene.lineSegments.forEach(segment => {
            segment.update();
        })
        this.rays.forEach(ray =>{
            ray.intersections = scene.update(ray);
        });
    }

    update(){
        /*this.rays.forEach(ray =>{
            ray.start = {x: this.position.x, y: this.position.y};
            ray.end = 
        });*/
        for(let i=0; i < this.rayCoords.length; i++){
            this.rays[i].start = {x: this.position.x, y: this.position.y};

            let closestP;
            let distance; 
            let temp = 100000; //big number to find a point closer than it
            let dx;
            let dy;
            this.rays[i].intersections.forEach(point =>{ //works out each intersection point and its distance from the ray's origin
                dx = point[0]-this.position.x; 
                dy = point[1]-this.position.y;
                distance = Math.sqrt(dx*dx + dy*dy); //pythag
                if(distance < temp){
                    temp = distance;
                    closestP = point; //chooses the closest one
                }
            });
            this.rays[i].intersectionP = closestP; //set closest point to intersection point
            this.rays[i].end = {x: this.rayCoords[i].x+this.position.x, y: this.rayCoords[i].y+this.position.y}; //endpoint of non-intersecting rays
        }
    }

    draw(ctx){
        this.rays.forEach(ray =>{
            if(ray.intersectionP){ray.drawIntersectingLine(ctx);}else{ray.drawLine(ctx);}
        });
    }
}