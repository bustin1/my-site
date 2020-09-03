
const bezier_canvas = document.getElementById('bezier-canvas');
const bezier_ctx = bezier_canvas.getContext('2d');
const DRAG_RADIUS = 400; //radius squared
const BEZIER_TIME_STEP = .01; // determines how many points of the point will be drawn

let drag = {state : false, i : -1}; // state := flag, i := which point is dragged
let control_pts = [];
let t = 0;

/*
 * creates key event listeners to drag the points
 */
function initBezierEvents()
{
    bezier_canvas.addEventListener('mousedown', e => {
        for(let i=0; i<control_pts.length; i++)
        {
            let dx = (e.offsetX - control_pts[i].x);
            let dy = (e.offsetY - control_pts[i].y);
            if(dx * dx + dy * dy < DRAG_RADIUS)
            {
                drag.state = true;
                drag.i = i;
                break;
            }
        }
        if (!drag.state)
        {
            bezier_ctx.fillStyle = 'white';
            bezier_ctx.fillRect(e.offsetX, e.offsetY, 5, 5)
            control_pts.push({x : e.offsetX, y : e.offsetY});
        }
    });
    bezier_canvas.addEventListener('mousemove', e => {
        if(drag.state)
        {
            control_pts[drag.i].x = e.offsetX; 
            control_pts[drag.i].y = e.offsetY; 
            bezier_ctx.clearRect(0, 0, canvas.width, canvas.height);
            bezier_ctx.strokeStyle = 'red';
            for(let i=0; i<control_pts.length-1; i++)
            {
                bezier_ctx.strokeStyle = 'red';
                bezier_ctx.beginPath();
                bezier_ctx.moveTo(control_pts[i].x, control_pts[i].y);
                bezier_ctx.lineTo(control_pts[i+1].x, control_pts[i+1].y);
                bezier_ctx.stroke();
                bezier_ctx.fillStyle = 'white';
                bezier_ctx.fillRect(control_pts[i].x, control_pts[i].y, 5, 5)
            }
            bezier_ctx.fillRect(control_pts[control_pts.length-1].x, control_pts[control_pts.length-1].y, 5, 5)
            bezier_ctx.strokeStyle = 'green';
        }
    });
    bezier_canvas.addEventListener('mouseup', e => {
        if (drag.state)
        {
            initGraph();
            drag.state = false
            t = 0;
        }
    });
    document.getElementsByClassName('bezier-button')[0].onclick = initGraph;
    document.getElementsByClassName('bezier-button')[1].onclick = function cleargraph() {
        bezier_ctx.clearRect(0, 0, canvas.width, canvas.height)
        control_pts = [];
        t = 0;
    };
}

initBezierEvents();



/*
 * graph settings
 */
function initGraph()
{
    t = 0;
    window.requestAnimationFrame(graph);
    bezier_ctx.strokeStyle = 'red';
    for(let i=0; i<control_pts.length-1; i++)
    {
        bezier_ctx.beginPath();
        bezier_ctx.moveTo(control_pts[i].x, control_pts[i].y);
        bezier_ctx.lineTo(control_pts[i+1].x, control_pts[i+1].y);
        bezier_ctx.stroke();
    }
    bezier_ctx.strokeStyle = 'green';
}

/*
 * graph the curve starting from x1, y1 until enire curve drawn(t=1)
 */
function graph(x1, y1)
{
    point = interpolate(control_pts);
    bezier_ctx.beginPath();
    bezier_ctx.moveTo(x1, y1);
    bezier_ctx.lineTo(point.x, point.y);
    bezier_ctx.stroke();
    t += BEZIER_TIME_STEP;
    if(t < 1)
    {
        window.requestAnimationFrame(e => {
            graph(point.x, point.y);
        });
    }
}

/*
 * linear interpolation of the controls points
 * to return the location of the next point to be drawn
 */
function interpolate(control_pts)
{
    if(control_pts.length == 2)
    {
        return {x : t*control_pts[1].x + (1-t)*control_pts[0].x, y : t*control_pts[1].y + (1-t)*control_pts[0].y}; //return an object
    }
    else if (control_pts.length > 2)
    {
        new_pts = []
        for(let i=0; i<control_pts.length-1; i++)
        {
            x1 = t*control_pts[i+1].x + (1-t)*control_pts[i].x;
            y1 = t*control_pts[i+1].y + (1-t)*control_pts[i].y;
            new_pts.push({x : x1, y : y1});
        }
        return interpolate(new_pts);
    }
    else
    {
        return control_pts[0];
    }
}






