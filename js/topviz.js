/* Get the big background canvas */
var front_canvas = document.getElementById('graph-canvas-small');
var front_ctx = front_canvas.getContext('2d');

/* Initialize some variables to dummy values */
var front_w = front_canvas.width;
var front_h = front_canvas.height;
var front_points = [];
var front_speeds = [];
var front_colors = [];

/* Set the speed at which points travel */
var front_v = 1;

/* Set the number of points along the sides of and inside of the canvas */
front_num_w_points = 5;
front_num_h_points = 1;
front_num_i_points = 50;

/* Colors to chose from */
var front_colort = [[0,0,0,0], [255, 0, 255, 0.2]];

/* Resize the canvas element and re-generate points based on calculated
 * width and height. Old edge and corner points are deleted, and new ones
 * are added corresponding to the new coordinates of the edges and corners.
*/
function resizeFrontCanvas() {
    // Grab the calculated dimensions
    var cs = getComputedStyle(front_canvas);
    front_w = parseInt(cs.getPropertyValue('width'), 10);
    front_h = parseInt(cs.getPropertyValue('height'), 10);
    front_canvas.width = front_w + "px";
    front_canvas.height = front_h + "px";

    // scale if Hi-DPI for better quality
    if (window.devicePixelRatio >= 2) {
        front_canvas.width = front_w * 2;
        front_canvas.height = front_h * 2;
        front_ctx.scale(2, 2);
    }

    // Remove old corner and edge points
    for (var i = 0; i < front_num_w_points + front_num_h_points + 4; i++) {
        front_points.pop();
        front_speeds.pop();
    }

    // Add new points
    for (var i = 0; i < front_num_w_points; i++) {
        front_points.push([Math.random() * front_w, 0]);
        front_speeds.push([Math.random() * front_v + 1, 0]);
        front_points.push([Math.random() * front_w, front_h]);
        front_speeds.push([Math.random() * front_v + 1, 0]);
    }

    for (var i = 0; i < front_num_h_points; i++) {
        front_points.push([0, Math.random() * front_h]);
        front_speeds.push([0, Math.random() * front_v + 1]);
        front_points.push([front_w, Math.random() * front_h]);
        front_speeds.push([0, Math.random() * front_v + 1]);
    }

    front_points.push([0, 0]);
    front_points.push([front_w, 0]);
    front_points.push([0, front_h]);
    front_points.push([front_w, front_h]);
    front_speeds.push([0, 0]);
    front_speeds.push([0, 0]);
    front_speeds.push([0, 0]);
    front_speeds.push([0, 0]);
    front_speeds[0] = [0, 0];
}

/* Do our first resizing now */
resizeFrontCanvas();

/* Add our internal points in the canvas now */
for (var i = 0; i < front_num_i_points; i++) {
    front_points.push([Math.random() * front_w, Math.random() * front_h]);
    front_speeds.push([front_v * Math.cos(Math.random() * Math.PI), front_v * Math.sin(Math.random() * Math.PI)]); 
}

/* Do our first resizing now */
resizeFrontCanvas();

/* Now that we have all of our points, initialize the colors array to assign them colors */
for (var i = 0; i < front_points.length; i++) {
    front_colors.push(front_colort[i % front_colort.length]);
}

/* Average 3 RGBA colors, to get the color that a triangle should be inside */
function avgRGBA3(C1, C2, C3) {
    R = Math.floor((C1[0] + C2[0] + C3[0]) / 3);
    G = Math.floor((C1[1] + C2[1] + C3[1]) / 3);
    B = Math.floor((C1[2] + C2[2] + C3[2]) / 3);
    A = (C1[3] + C2[3] + C3[3]) / 3;
    return "rgba(" + R + ", " + G + ", " + B + ", " + A + ")";
}

/* Convert an array of 4 elements to an RGBA value formatted as expected by the canvas */
function RGBA(C) {
    return "rgba(" + C[0] + ", " + C[1] + ", " + C[2] + ", " + C[3] + ")";

}

/* Main function called in draw loop */
function front_draw() {
    for (var i = 0; i < front_points.length; i++) {
        if (front_points[i][0] + front_speeds[i][0] > front_w || front_points[i][0] + front_speeds[i][0] < 0) {
            front_speeds[i][0] *= -1;
        }
        if (front_points[i][1] + front_speeds[i][1] > front_h || front_points[i][1] + front_speeds[i][1] < 0) {
            front_speeds[i][1] *= -1;
        }
        front_points[i][0] += front_speeds[i][0];
        front_points[i][1] += front_speeds[i][1];
    }

    delaunay = new Delaunator(front_points);

    front_ctx.clearRect(0, 0, front_w, front_h);

    var triangles = delaunay.triangles;

    for (var i = 0; i < triangles.length; i += 3) {
        var p0 = triangles[i];
        var p1 = triangles[i + 1];
        var p2 = triangles[i + 2];

        front_ctx.beginPath();
        front_ctx.moveTo(front_points[p0][0], front_points[p0][1]);
        front_ctx.lineTo(front_points[p1][0], front_points[p1][1]);
        front_ctx.lineTo(front_points[p2][0], front_points[p2][1]);
        front_ctx.closePath();
        front_ctx.strokeStyle = 'rgba(190, 135, 170, 1)';
        front_ctx.lineWidth = 1;
        front_ctx.stroke();
        front_ctx.fillStyle = avgRGBA3(front_colors[p0], front_colors[p1], front_colors[p2]);
        front_ctx.fill();
    }

    for (var i = 0; i < front_points.length; i++) {
        front_ctx.beginPath();
        front_ctx.moveTo(front_points[i][0] + 9, front_points[i][1]);
        front_ctx.lineTo(front_points[i][0], front_points[i][1] + 9);
        front_ctx.lineTo(front_points[i][0] - 9, front_points[i][1]);
        front_ctx.lineTo(front_points[i][0], front_points[i][1] - 9);
        //front_ctx.rect(front_points[i][0] - 7, front_points[i][1] - 7, 14, 14);
        front_ctx.closePath();
        front_ctx.strokeStyle = 'rgba(135,0,135,1)';
        front_ctx.lineWidth = 1;
        front_ctx.stroke();
        if (front_colors[i][1] == 0) {

        }
        front_ctx.fillStyle = RGBA(front_colors[i]);
        front_ctx.fill();
    }
}

/* Register the request for draw to be called repeatedly */
function front_frame() {
    requestAnimationFrame(front_frame);
    front_draw();
}
front_frame();
