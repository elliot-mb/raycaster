import LineSegment from "/src/line.js";
import Point from "/src/point.js";
import Intersection from "/src/intersection.js";

export default class Scene{
    constructor(){ //Point(spawnx, spawny, draggable)
        this.lineSegments = [new LineSegment(new Point(200,100,true), new Point(200,400,true)),
            new LineSegment(new Point(100,400,true), new Point(100,100,true)),
            new LineSegment(new Point(100,100,true), new Point(201,100,true)),
            new LineSegment(new Point(100,450,true), new Point(1050,120,true)),
            new LineSegment(new Point(200,150,true), new Point(650,550,true)),
            new LineSegment(new Point(599,600,true), new Point(701,600,true)), //box
            new LineSegment(new Point(700,599,true), new Point(700,701,true)),
            new LineSegment(new Point(701,700,true), new Point(599,700,true)),
            new LineSegment(new Point(600,701,true), new Point(600,599,true)), //box end
            new LineSegment(new Point(899,300,true), new Point(951,300,true)), //rectangle
            new LineSegment(new Point(950,299,true), new Point(950,601,true)),
            new LineSegment(new Point(951,600,true), new Point(899,600,true)),
            new LineSegment(new Point(900,601,true), new Point(899,299,true))]; //walls in the scene
        this.points;
        //this.intersections = []; //intersection is never draggable but inherits from point
        this.isIntersecting = false;
    }

    initialise(){
        this.points = [];
        this.lineSegments.forEach(lineSegment => {
            this.points.push(lineSegment.start);
            this.points.push(lineSegment.end);
            lineSegment.update(); 
            lineSegment.initialise();
        });
    }

    update(ray){ //checks intersections with all walls per ray
        ray.update(); //computes ABC for ray
        //let intersects = [];

        let dx, dy, nearPoint, dist; //values for computing the distance
        let temp = 10000;
        //ray.isIntersecting = false;
        let i = 0;
        this.lineSegments.forEach(segment =>{ //checks each wall in the scene
            segment.update(); //computes ABC for segment

            //computes intersection
            let denominator = (ray.A*segment.B - segment.A*ray.B);

            if(denominator == 0){
                //not intersecting because parallel
                //console.log('parallel/colinear');
            }else{
                let xDividend = segment.B*ray.C - ray.B*segment.C;
                let yDividend = ray.A*segment.C - segment.A*ray.C;
                let x = xDividend/denominator; //x and y of the intersection
                let y = yDividend/denominator;
                //console.log(Math.round(xDividend),Math.round(yDividend),Math.round(denominator));
                let rx0 = (x-ray.start.x)/(ray.end.x-ray.start.x); //if bigger than 1 or smaller than 0, intersection is not within line segment
                let ry0 = (y-ray.start.y)/(ray.end.y-ray.start.y);
                let rx1 = (x-segment.start.x)/(segment.end.x-segment.start.x); 
                let ry1 = (y-segment.start.y)/(segment.end.y-segment.start.y);
                if(rx0>=1||rx1>=1||ry0>=1||ry1>=1||rx0<=0||rx1<=0||ry0<=0||ry1<=0){ //these ratios combined determine if the line segment intersects
                    //console.log(`segment ${i} check ${rx0},${rx1},${ry0},${ry1}`); //this logic is actually inadequet as it doesnt handle parallel and vertical lines
                    //outside segment                                                //this is why the line.initialise method was needed, makes sure no lines are parrlell at the start
                }else{
                    dx = x-ray.start.x; //this code now decides on the closest intersection point instead of looping to find it in the raycast class like in v4
                    dy = y-ray.start.y;
                    dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < temp){
                        temp = dist;
                        nearPoint = [x,y];
                    }
                }
            }
            i++;
        });
        //console.log(ray, nearPoint);
        return nearPoint;
        //return intersects;
    }

    draw(ctx){ //draw lines and points
        this.lineSegments.forEach(lineSegment =>{
            lineSegment.draw(ctx);
        });
        //console.log(this.isIntersecting);
        //if(this.isIntersecting){
        //    this.intersections.forEach(intersection => {
        //        intersection.draw(ctx);
        //    });
        //}
        //this.intersections.forEach(intersection => {
        //    intersection.draw(ctx);
        //});
        //if(this.isIntersecting){
        //    this.intersection.draw(ctx);
        //}
    }

}