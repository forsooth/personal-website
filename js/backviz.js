/* Get the big background canvas */
var back_canvas = document.getElementById('graph-canvas-large');
var back_ctx = back_canvas.getContext('2d');

/* Initialize some variables to dummy values */
var w = back_canvas.width;
var h = back_canvas.height;
var back_points = [];
var back_speeds = [];
var back_colors = [];
/* Set our color scheme for filling in polygons */
var back_colort = [[255, 255, 135, 1], [255, 215, 135, 1], [255, 175, 135, 1], [255, 135, 135, 1], [255, 95, 135, 1], [255, 0, 135, 1]];

/* Set the speed at which points travel */
var back_v = 1;

/* Set the number of points along the sides of and inside of the canvas */
var back_num_w_points = 10;
var back_num_h_points = 10;
var back_num_i_points = 100;

/* Resize the canvas element and re-generate points based on calculated
 * width and height. Old edge and corner points are deleted, and new ones
 * are added corresponding to the new coordinates of the edges and corners.
*/
function resizeBackCanvas() {
    // Grab the calculated dimensions
    var cs = getComputedStyle(back_canvas);
    back_w = parseInt(cs.getPropertyValue('width'), 10);
    back_h = parseInt(cs.getPropertyValue('height'), 10);
    back_canvas.width = back_w;
    back_canvas.height = back_h;

    // scale if Hi-DPI for better quality
    if (window.devicePixelRatio >= 2) {
        back_canvas.width = back_w * 2;
        back_canvas.height = back_h * 2;
        back_ctx.scale(2, 2);
    }

    // Remove old corner and edge points
    for (var i = 0; i < back_num_w_points + back_num_h_points + 4; i++) {
        back_points.pop();
        back_speeds.pop();
    }

    // Add new points
    for (var i = 0; i < back_num_w_points; i++) {
        back_points.push([Math.random() * back_w, 0]);
        back_speeds.push([Math.random() * back_v + 1, 0]);
        back_points.push([Math.random() * back_w, back_h]);
        back_speeds.push([Math.random() * back_v + 1, 0]);
    }

    for (var i = 0; i < back_num_h_points; i++) {
        back_points.push([0, Math.random() * back_h]);
        back_speeds.push([0, Math.random() * back_v + 1]);
        back_points.push([back_w, Math.random() * back_h]);
        back_speeds.push([0, Math.random() * back_v + 1]); 
    }

    back_points.push([0, 0]);
    back_points.push([back_w, 0]);
    back_points.push([0, back_h]);
    back_points.push([back_w, back_h]);
    back_speeds.push([0, 0]);
    back_speeds.push([0, 0]);
    back_speeds.push([0, 0]);
    back_speeds.push([0, 0]);
    back_speeds[0] = [0, 0];

    back_colors = [];
    for (var i = 0; i < back_points.length; i++) {
        back_colors.push(back_colort[i % back_colort.length]);
    }
}

/* Do our first resizing now */
resizeBackCanvas();

/* Add our internal points in the canvas now */
for (var i = 0; i < back_num_i_points; i++) {
    back_points.push([Math.random() * back_w, Math.random() * back_h]);
    back_speeds.push([back_v * Math.cos(Math.random() * Math.PI), back_v * Math.sin(Math.random() * Math.PI)]); 
}

/* Now that we have all of our points, initialize the colors array to assign them colors */
for (var i = 0; i < back_points.length; i++) {
    back_colors.push(back_colort[i % back_colort.length]);
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

/* Register that point 0 should follow the mouse */
back_canvas.onmousemove = function (e) {
    back_points[0][0] = (e.offsetX);
    back_points[0][1] = (e.offsetY);
}

/* Register that the color of the follower point should change when the mouse is clicked */
back_canvas.onclick = function (e) {
    back_colors[0] = [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1];
}

/* Main function called in draw loop */
function back_draw() {
    for (var i = 0; i < back_points.length; i++) {
        if (back_points[i][0] + back_speeds[i][0] > back_w || back_points[i][0] + back_speeds[i][0] < 0) {
            back_speeds[i][0] *= -1;
        }
        if (back_points[i][1] + back_speeds[i][1] > back_h || back_points[i][1] + back_speeds[i][1] < 0) {
            back_speeds[i][1] *= -1;
        }
        back_points[i][0] += back_speeds[i][0];
        back_points[i][1] += back_speeds[i][1];

    }

    delaunay = new Delaunator(back_points);

    back_ctx.clearRect(0, 0, back_w, back_h);

    var triangles = delaunay.triangles;

    for (var i = 0; i < triangles.length; i += 3) {
        var p0 = triangles[i];
        var p1 = triangles[i + 1];
        var p2 = triangles[i + 2];

        back_ctx.beginPath();
        back_ctx.moveTo(back_points[p0][0], back_points[p0][1]);
        back_ctx.lineTo(back_points[p1][0], back_points[p1][1]);
        back_ctx.lineTo(back_points[p2][0], back_points[p2][1]);
        back_ctx.closePath();
        back_ctx.strokeStyle = 'rgba(0,0,0,1)';
        back_ctx.lineWidth = 1;
        back_ctx.stroke();
        back_ctx.fillStyle = avgRGBA3(back_colors[p0], back_colors[p1], back_colors[p2]);
        back_ctx.fill();
    }
}

/* Register the request for draw to be called repeatedly */
function back_frame() {
    requestAnimationFrame(back_frame);
    back_draw();
}
back_frame();
