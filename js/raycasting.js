

class Wall
{
    constructor(pos1, pos2)
    {
        this.pos = pos1;
        this.dir = {x : pos2.x-pos1.x, y : pos2.y - pos1.y};
    }
    draw()
    {
        raycasting_ctx.strokeStyle = 'white';
        raycasting_ctx.lineWidth = 5;
        raycasting_ctx.beginPath();
        raycasting_ctx.moveTo(this.pos.x, this.pos.y);
        raycasting_ctx.lineTo(this.pos.x + this.dir.x, this.pos.y + this.dir.y);
        raycasting_ctx.stroke();
    }
}


class Ray
{
    constructor(px, py, angle)
    {
        this.pos = {x : px, y : py};
        this.dir = {x : Math.cos(angle), y : Math.sin(angle)};
        this.angle = angle;
        this.toX = 0;
        this.toY = 0;
        this.dist = Infinity;
        this.cast();
    }
    cast()
    {
        let lowest_T1 = Infinity;

        let px1 = this.pos.x;
        let py1 = this.pos.y;
        let dx1 = this.dir.x;
        let dy1 = this.dir.y;

        for(let i=0; i<walls.length; i++)
        {
            let px2 = walls[i].pos.x;
            let py2 = walls[i].pos.y;
            let dx2 = walls[i].dir.x;
            let dy2 = walls[i].dir.y;

            if(Math.abs(dy2/dx2 - dy1/dx1) > .00001)// check parallel
            { 
                let T2 = (dx1*(py2-py1) + dy1*(px1-px2))/(dx2*dy1 - dx1*dy2);
                if (0 <= T2 && T2 <= 1)
                {
                    let T1 = (px2-px1+dx2*T2)/dx1;
                    if(T1 >= 0 && T1 < lowest_T1)
                    {
                        lowest_T1 = T1; 
                    }
                }
            }
        }
        this.toX = px1 + lowest_T1*dx1;
        this.toY = py1 + lowest_T1*dy1;
        // fisheye
        this.dist = Math.sqrt(
            (this.toX - this.pos.x) * (this.toX - this.pos.x) + 
            (this.toY - this.pos.y) * (this.toY - this.pos.y)
        );

        if(!fisheye)
        {
            this.dist *= Math.cos(this.angle - cameraPlaneAngle);
        }
    }
}   

let fisheye = false; // toggle for fisheye
function changeFisheye()
{
    fisheye = !fisheye;
    if(fisheye)
    {
        document.getElementsByClassName('toggle')[0].innerHTML = 'Toggle for no Fisheye';
    }
    else
    {
        document.getElementsByClassName('toggle')[0].innerHTML = 'Toggle for Fisheye';
    }
}

let wideview = true; // toggle for wide view(example on webpage)
function changeWideView()
{
    wideview = !wideview;
    if(wideview)
    {
        document.getElementsByClassName('toggle')[1].innerHTML = 'Toggle for Ray View to use Slider';
    }
    else
    {
        document.getElementsByClassName('toggle')[1].innerHTML = 'Toggle for Wide View';
    }
}


let VIEW_ANGLE = Math.PI * 2; // Field of View angle
function changeView(val)
{
    document.getElementById('slider-value').innerHTML = val+'&#176;';
    VIEW_ANGLE = val / 180 * Math.PI;
}

const VIEW_RADIUS = 350;
const STEP_ANGLE = .02;
const raycasting_canvas = document.getElementById('raycasting-canvas');
const raycasting_ctx = raycasting_canvas.getContext('2d');
let player = {x : 0, y : 0};
let cameraPlaneAngle = 0;
let walls = [
    new Wall({x : 0, y : 0}, {x : raycasting_canvas.width/2, y : 0}),
    new Wall({x : raycasting_canvas.width/2, y : 0}, {x : raycasting_canvas.width/2, y : raycasting_canvas.height}),
    new Wall({x : raycasting_canvas.width/2, y : raycasting_canvas.height}, {x : 0, y : raycasting_canvas.height}),
    new Wall({x : 0, y : raycasting_canvas.height}, {x : 0, y : 0}),

    // inner wall
    new Wall({x : 100, y : 100}, {x : raycasting_canvas.width/2-100, y : 100}),
    new Wall({x : raycasting_canvas.width/2-100, y : 100}, {x : raycasting_canvas.width/2-100, y : raycasting_canvas.height-100}),
    new Wall({x : raycasting_canvas.width/2-100, y : raycasting_canvas.height-100}, {x : 100, y : raycasting_canvas.height-100}),

    //outer wall
    new Wall({x : 100, y : 50}, {x : raycasting_canvas.width/2-100, y : 50}),
    new Wall({x : 100, y : 50}, {x : 50, y : 100}),
    new Wall({x : 50, y : 100}, {x : 50, y : raycasting_canvas.height-100}),
    new Wall({x : 50, y : raycasting_canvas.height-100}, {x : 100, y : raycasting_canvas.height-50}),
    new Wall({x : 100, y : raycasting_canvas.height-50}, {x : raycasting_canvas.width/2 - 100, y : raycasting_canvas.height-50}),

    // that one wall
    new Wall({x : raycasting_canvas.width/4, y : raycasting_canvas.height/2 - 100},
        {x : raycasting_canvas.width/4, y : raycasting_canvas.height/2 + 100})

];


/*
 * initialize key events
 */
function initRaycastEvents()
{
    window.addEventListener('keydown', e => {
        if (e.keyCode == 65)
        {
            cameraPlaneAngle -= STEP_ANGLE;
        }
        else if (e.keyCode == 68)
        {
            cameraPlaneAngle += STEP_ANGLE;
        }
        if (!wideview)
        {
            view(player.x, player.y);
        }
    });
    raycasting_canvas.addEventListener('mouseleave', e => {
        raycasting_ctx.clearRect(0, 0, raycasting_canvas.width, raycasting_canvas.height);
        drawWalls(walls);
    });

    raycasting_canvas.addEventListener('mousemove', e => {
        player.x = e.offsetX;
        player.y = e.offsetY;
        if (wideview)
        {
            wideView(e);
        }
        else
        {
            view(player.x, player.y);
        }
    });
    drawWalls(walls);
}
initRaycastEvents();


/*
 * draw the walls
 */
function drawWalls(walls)
{
    for(let i=0; i<walls.length; i++)
    {
        walls[i].draw();
    }
}





/*
 * Drags the RHS of the raycasting_canvas,
 * which depicts what we might see in 3d
 * if walking in the maze
 */
function drawScene(scene)
{
    function mapper(v, a1, a2, b1, b2)
    {
        return (v - a1) / (a2 - a1) * (b2 - b1) + b1;
    }
    const width = (raycasting_canvas.width/2) / scene.length;
    const offsetX = raycasting_canvas.width / 2;
    for(let i=0; i<scene.length; i++)
    {
        let opaqueness = mapper(scene[i], 0, VIEW_RADIUS, 1, 0) 
        raycasting_ctx.fillStyle = `rgba(255, 255, 255, ${opaqueness})`;

        let x = i * width + offsetX;
        let h = mapper(scene[i], 0, VIEW_RADIUS, VIEW_RADIUS, 0);
        let w = width;
        let y = (raycasting_canvas.height - h) / 2
        raycasting_ctx.fillRect(x, y, w, h);
    }
}

/*
 * draws the outbound light source at x,y based on the
 * VIEW_ANGLE and cameraPlaneAngle
 */
function view(x, y)
{
    raycasting_ctx.clearRect(0, 0, raycasting_canvas.width, raycasting_canvas.height);
    drawWalls(walls);
    raycasting_ctx.strokeStyle = lightStyle(x, y);
    let rays = [];
    let scene = [];
    for(let i=-VIEW_ANGLE/2 + cameraPlaneAngle; i<VIEW_ANGLE/2 + cameraPlaneAngle; i += STEP_ANGLE)
    {
        let r = new Ray(x, y, i);
        raycasting_ctx.beginPath();
        raycasting_ctx.moveTo(x, y);
        raycasting_ctx.lineTo(r.toX, r.toY);
        raycasting_ctx.stroke();
        scene.push(r.dist);
    }
    drawScene(scene); 
}


/* 
 * draws the wideView,
 * which is a smooth 360 degrees
 */
function wideView(e)
{
    raycasting_ctx.clearRect(0, 0, raycasting_canvas.width, raycasting_canvas.height);
    let rays = [];
    for(let i=0; i<walls.length; i++)
    {
        walls[i].draw();
        let angle1 = Math.atan2(walls[i].pos.y-e.offsetY, walls[i].pos.x-e.offsetX);
        let angle2 = Math.atan2(walls[i].pos.y+walls[i].dir.y-e.offsetY, walls[i].pos.x+walls[i].dir.x-e.offsetX);

        rays.push(new Ray(e.offsetX, e.offsetY, angle1-.00001));
        rays.push(new Ray(e.offsetX, e.offsetY, angle1));
        rays.push(new Ray(e.offsetX, e.offsetY, angle1+.00001));
        rays.push(new Ray(e.offsetX, e.offsetY, angle2-.00001));
        rays.push(new Ray(e.offsetX, e.offsetY, angle2));
        rays.push(new Ray(e.offsetX, e.offsetY, angle2+.00001));

    }

    // draw triangles of vision
    rays.sort((a, b) => {return a.angle - b.angle}); // sort from smallest to biggest to create polygon
    rays.push(rays[0]);


    raycasting_ctx.beginPath();
    raycasting_ctx.fillStyle = lightStyle(e.offsetX, e.offsetY);
    for(let i=0; i<rays.length-1; i++)
    {
        raycasting_ctx.moveTo(e.offsetX, e.offsetY);
        raycasting_ctx.lineTo(rays[i].toX, rays[i].toY);
        raycasting_ctx.lineTo(rays[i+1].toX, rays[i+1].toY);
    }
    raycasting_ctx.fill();

}

/*
 * Returns radial gradient style starting from x,y to emulate
 * a light source
 */
function lightStyle(x, y)
{
    let grd = raycasting_ctx.createRadialGradient(x, y, 0, x, y, VIEW_RADIUS);
    grd.addColorStop(0, 'rgba(238, 221, 130, 1)');
    grd.addColorStop(1, 'rgba(238, 221, 130, 0)');
    return grd;
}
























