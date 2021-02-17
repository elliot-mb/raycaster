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

let deltaTime = 0, lastTime = 0, fps = 0;
let mouseX = 350, mouseY = 150;
let dragging = false;
let scene = new Scene();
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
canvas.addEventListener('mousedown', (event) => {
    getMouse(event);
    scene.points.forEach(point =>{
        point.click({x: mouseX, y: mouseY});
    });
    dragging = true;
}); 
canvas.addEventListener('mousemove', (event) => {
    if(dragging){
        getMouse(event);
        scene.points.forEach(point =>{
            if(point.dragging){point.drag({x: mouseX, y: mouseY});}
        });
    }
});
canvas.addEventListener('mouseup', (event) => {
    getMouse(event);
    scene.points.forEach(point =>{
        point.dragging = false;
    });
    dragging = false;
}); 
window.addEventListener('keyup', (event) => {
    if(event.code == "KeyM"){
        if(renderScene){renderScene = false;}else{renderScene = true;}
    }
    if(event.code == "KeyN"){
        if(renderRaycast){renderRaycast = false;}else{renderRaycast = true;}
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
    /*setTimeout(function(){*/ //slowed framerate to help sort out rendering bugs
        deltaTime = timestamp - lastTime; //calculates delta time (frame time)
        lastTime = timestamp;
        fps = 1000/deltaTime;
    
        raycast.position = {x: mouseX, y: mouseY};
    
        background();
        raycast.update();
        raycast.intersect(scene);
        //if(dragging){scene.update();}
        //scene.update();
        if(renderRaycast){raycast.draw(ctx);}
        if(renderScene){scene.draw(ctx);}
        
        requestAnimationFrame(mainLoop);
    /*}, 500);*/
}

mainLoop();

function background(){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    text();
}

function text(){
    ctx.fillStyle = '#ffffff';
    ctx.font = "30px Arial";
    ctx.fillText(`simple raycaster, ${raycast.instance} rays @ ${Math.round(fps)}fps`, 600, 50); 
    ctx.font = "20px Arial";
    ctx.fillText("- hold mouse to move light source", 600, 80);
    ctx.fillText("- drag transluscent circles", 600, 110);
    ctx.fillText("- m to toggle walls, n to toggle light", 600, 140);
    ctx.fillText(`- j/k to decrease/increase rays respectively`, 600, 170);
    ctx.fillText(`- if fps lower than your refresh rate, consider lowering # of rays`, 600, 200);
}