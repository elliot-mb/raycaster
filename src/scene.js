import LineSegment from "/src/line.js";
import Point from "/src/point.js";
import Intersection from "/src/intersection.js";

export default class Scene{
    constructor(){ //Point(spawnx, spawny, draggable)
        this.lineSegments = [new LineSegment(new Point(115,150,true), new Point(100,850,true)),
            new LineSegment(new Point(205,100,true), new Point(550,150,true)),
            new LineSegment(new Point(265,100,true), new Point(660,150,true)),
            new LineSegment(new Point(34,450,true), new Point(550,600,true))]; //walls in the scene
        this.points;
        //this.intersections = []; //intersection is never draggable but inherits from point
        this.isIntersecting = false;
    }

    initialise(){
        this.points = [];
        this.lineSegments.forEach(lineSegment => {
            this.points.push(lineSegment.start);
            this.points.push(lineSegment.end);
        });
    }

    update(ray){ //checks intersections with all walls per ray
        ray.update(); //computes ABC for ray
        let intersects = [];
        this.lineSegments.forEach(segment =>{ //checks each wall in the scene
            //segment.update(); //computes ABC for segment

            //computes intersection
            let denominator = (ray.A*segment.B - segment.A*ray.B);

            if(denominator == 0){
                this.isIntersecting = false;
            }else{
                let xDividend = segment.B*ray.C - ray.B*segment.C;
                let yDividend = ray.A*segment.C - segment.A*ray.C;
                let x = xDividend/denominator; //x and y of the intersection
                let y = yDividend/denominator;
                let rx0 = (x-ray.start.x)/(ray.end.x-ray.start.x); //if bigger than 1 or smaller than 0, intersection is not within line segment
                let ry0 = (y-ray.start.y)/(ray.end.y-ray.start.y);
                let rx1 = (x-segment.start.x)/(segment.end.x-segment.start.x); 
                let ry1 = (y-segment.start.y)/(segment.end.y-segment.start.y);
                if(rx0>=1||rx1>=1||ry0>=1||ry1>=1||rx0<=0||rx1<=0||ry0<=0||ry1<=0){ //these ratios combined determine if the line segment intersects
                    //console.log(rx0,rx1,ry0,ry1);
                    this.isIntersecting = false;
                }else{
                    intersects.push([x,y]);
                    //this.intersections.push(new Intersection(x,y)); //pushes each intersection point
                    //this.intersection.position.x = x;
                    //this.intersection.position.y = y;
                    this.isIntersecting = true;
                }
            }
        });
        return intersects;
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