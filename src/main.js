import Scene from "/src/scene.js";
import Raycast from "/src/raycast.js"
//import LineSegment from "/src/line.js";
//import Point from "/src/point.js";

var canvas = document.getElementById("canvas"); 
var ctx = canvas.getContext("2d"); 
window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let scene = new Scene(canvas);
let deltaTime = 0, lastTime = 0, fps = 0;
let mouseX = 350, mouseY = 150;
let dragging = false;
let renderScene = true;
let raycast = new Raycast(150,150);
let renderRaycast = true;
raycast.generateRays();
//console.log(raycast);
scene.initialise();


function getMouse(event){
    mouseX = event.clientX, mouseY = event.clientY;
}

//interaction handler
canvas.addEventListener('mousedown', (event) => { //clicking points
    getMouse(event);
    scene.points.forEach(point =>{
        point.click({x: mouseX, y: mouseY});
    });
    dragging = true;
}); 
canvas.addEventListener('mousemove', (event) => { //dragging points
    if(dragging){
        getMouse(event);
        scene.points.forEach(point =>{
            if(point.dragging){point.drag({x: mouseX, y: mouseY});}
        });
    }
});
canvas.addEventListener('mouseup', (event) => { //dropping points
    getMouse(event);
    scene.points.forEach(point =>{
        point.dragging = false;
    });
    dragging = false;
}); 
window.addEventListener('keyup', (event) => { //ray controls
    if(event.code == "KeyM"){
        if(renderScene){renderScene = false;}else{renderScene = true;}
    }
    if(event.code == "KeyN"){
        raycast.renderState++;
    }
    if(event.code == "KeyK"){
        raycast.instance += 50;
        raycast.generateRays();
    }
    if(event.code == "KeyJ"){
        if(raycast.instance > 50){
            raycast.instance -= 50;
            raycast.generateRays();
        }
    }
}); 

function mainLoop(timestamp){
    //setTimeout(function(){ //slowed framerate to help sort out rendering bugs
        deltaTime = timestamp - lastTime; //calculates delta time (frame time)
        lastTime = timestamp;
        fps = 1000/deltaTime;
    
        raycast.position = {x: mouseX, y: mouseY};
    
        background();
        raycast.update();
        raycast.intersect(scene);
        //if(dragging){scene.update();}
        //scene.update();
        raycast.draw(ctx);
        if(renderScene){scene.draw(ctx);}
        text();
        
        requestAnimationFrame(mainLoop);
    //}, 500);
}

mainLoop();

function background(){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function text(){
    ctx.fillStyle = '#aaaaaa';
    ctx.font = "30px Arial";
    ctx.fillText(`simple raycaster, ${raycast.instance} rays @ ${Math.round(fps)}fps, mode ${raycast.modRenderState}`, 600, 50); 
    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Arial";
    ctx.fillText(`- m to toggle walls, n to change rendering mode (1 and 3 for best performance)`, 600, 80);
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText("- hold mouse to move light source", 600, 140);
    ctx.fillText("- drag transluscent circles", 600, 110);
    ctx.fillText(`- j/k to decrease/increase rays respectively`, 600, 170);
    ctx.fillText(`- if fps lower than your refresh rate, consider lowering # of rays`, 600, 200);
}