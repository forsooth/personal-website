var canvas = document.getElementById('graph-canvas-large');
var ctx = canvas.getContext('2d');

var minX = Infinity;
var minY = Infinity;
var maxX = -Infinity;
var maxY = -Infinity;


var w = canvas.width;
var h = canvas.height;

var points = [];
var speeds = [];
var colors = [];
var colort = [[255, 255, 135, 1], [255, 215, 135, 1], [255, 175, 135, 1], [255, 135, 135, 1], [255, 95, 135, 1], [255, 0, 135, 1]];

v = 1;

num_w_points = 10;
num_h_points = 10;
num_i_points = 100;

resizeCanvas();

/* Resize the canvas element and re-generate points based on calculated
 * width and height. Old edge and corner points are deleted, and new ones
 * are added corresponding to the new coordinates of the edges and corners.
*/
function resizeCanvas() {
    // Grab the calculated dimensions
    var cs = getComputedStyle(canvas);
    w = parseInt(cs.getPropertyValue('width'), 10);
    h = parseInt(cs.getPropertyValue('height'), 10);
    canvas.width = w + "px";
    canvas.height = h + "px";

    // scale if Hi-DPI for better quality
    if (window.devicePixelRatio >= 2) {
        canvas.width = w * 2;
        canvas.height = h * 2;
        ctx.scale(2, 2);
    }

    // Remove old corner and edge points
    for (var i = 0; i < num_w_points + num_h_points + 4; i++) {
        points.pop();
        speeds.pop();
    }

    // Add new points
    for (var i = 0; i < num_w_points; i++) {
        points.push([Math.random() * w, 0]);
        speeds.push([Math.random() * v + 1, 0]);
        points.push([Math.random() * w, h]);
        speeds.push([Math.random() * v + 1, 0]);
    }

    for (var i = 0; i < num_h_points; i++) {
        points.push([0, Math.random() * h]);
        speeds.push([0, Math.random() * v + 1]);
        points.push([w, Math.random() * h]);
        speeds.push([0, Math.random() * v + 1]); 
    }

    points.push([0, 0]);
    points.push([w, 0]);
    points.push([0, h]);
    points.push([w, h]);
    speeds.push([0, 0]);
    speeds.push([0, 0]);
    speeds.push([0, 0]);
    speeds.push([0, 0]);

    speeds[0] = [0, 0];

    colors = [];
    for (var i = 0; i < points.length; i++) {
        colors.push(colort[i % colort.length]);
    }
}

for (var i = 0; i < num_i_points; i++) {
    points.push([Math.random() * w, Math.random() * h]);
    speeds.push([v * Math.cos(Math.random() * Math.PI), v * Math.sin(Math.random() * Math.PI)]); 
}

for (var i = 0; i < points.length; i++) {
    colors.push(colort[i % colort.length]);
}

for (var i = 0; i < points.length; i++) {
    var x = points[i][0];
    var y = points[i][1];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
}

ctx.lineJoin = 'round';
ctx.lineCap = 'round';

var delaunay = new Delaunator(points);

function getX(i) {
    return points[i][0];
}
function getY(i) {
    return points[i][1];
}

function frame() {
    requestAnimationFrame(frame);
    draw();

}
frame();

function avgRGBA3(C1, C2, C3) {
    R = Math.floor((C1[0] + C2[0] + C3[0]) / 3);
    G = Math.floor((C1[1] + C2[1] + C3[1]) / 3);
    B = Math.floor((C1[2] + C2[2] + C3[2]) / 3);
    A = (C1[3] + C2[3] + C3[3]) / 3;
    return "rgba(" + R + ", " + G + ", " + B + ", " + A + ")";
}

function RGBA(C) {
    return "rgba(" + C[0] + ", " + C[1] + ", " + C[2] + ", " + C[3] + ")";

}

canvas.onmousemove = function (e) {
    points[0][0] = (e.layerX);
    points[0][1] = (e.layerY);
}

canvas.onclick = function (e) {
    colors[0] = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1];
}

function draw() {
    for (var i = 0; i < points.length; i++) {
        if (points[i][0] + speeds[i][0] > w || points[i][0] + speeds[i][0] < 0) {
            speeds[i][0] *= -1;
        }
        if (points[i][1] + speeds[i][1] > h || points[i][1] + speeds[i][1] < 0) {
            speeds[i][1] *= -1;
        }
        points[i][0] += speeds[i][0];
        points[i][1] += speeds[i][1];

    }

    delaunay = new Delaunator(points);

    ctx.clearRect(0, 0, w, h);

    var triangles = delaunay.triangles;

    for (var i = 0; i < triangles.length; i += 3) {
        var p0 = triangles[i];
        var p1 = triangles[i + 1];
        var p2 = triangles[i + 2];

        ctx.beginPath();
        ctx.moveTo(getX(p0), getY(p0));
        ctx.lineTo(getX(p1), getY(p1));
        ctx.lineTo(getX(p2), getY(p2));
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = avgRGBA3(colors[p0], colors[p1], colors[p2]);
        ctx.fill();
    }
    
    // for (var i = 0; i < points.length; i++) {
    //     ctx.beginPath();
    //     ctx.rect(getX(i) - 1.5, getY(i) - 1.5, 3, 3);
    //     ctx.closePath();
    //     ctx.strokeStyle = 'rgba(0,0,0,1)';
    //     ctx.lineWidth = 1;
    //     ctx.stroke();
    //     ctx.fillStyle = RGBA(colors[i]);
    //     ctx.fill();
    // }
}

