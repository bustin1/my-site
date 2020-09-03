
let canvas2 = document.getElementsByClassName('fourier-canvas');
let ctx20 = canvas2[0].getContext('2d');
let ctx21 = canvas2[1].getContext('2d');


let line = {xs : [], ys : [], marking : false};
let f = {amp : [], angle : [], x : [], y : []}; // my function f(t)


function initFourierEvents()
{
    window.requestAnimationFrame(drawLine);
    canvas2[0].addEventListener('mousedown', e => {
        ctx20.clearRect(0, 0, canvas2[0].width, canvas2[0].height);
        line.xs.push(e.offsetX);
        line.ys.push(e.offsetY);
        line.marker = true;
    });
    canvas2[0].addEventListener('mousemove', e => {
        if (line.marker)
        {
            drawLine(line.xs[line.xs.length - 1], line.ys[line.ys.length - 1], e.offsetX, e.offsetY);
            line.xs.push(e.offsetX);
            line.ys.push(e.offsetY);
            console.log(e.offsetX + ', ' + e.offsetY);
        }
    });
    canvas2[0].addEventListener('mouseup', e => {
        drawLine(line.xs[line.xs.length - 1], line.ys[line.ys.length - 1], e.offsetX, e.offsetY);
        line.xs.push(e.offsetX);
        line.ys.push(e.offsetY);
        line.marker = false;

        let coefx = fourier(line.xs);
        let coefy = fourier(line.ys);
        window.requestAnimationFrame(function () {
            rotate(0, coefx, coefy, []); // time = 0, path = []
        });
    });
}

initFourierEvents();


/* for freehand sketching */
function drawLine(x1, y1, x2, y2) {
    ctx20.beginPath();
    ctx20.strokeStyle = 'white';
    ctx20.lineWidth = 1;
    ctx20.moveTo(x1, y1);
    ctx20.lineTo(x2, y2);
    ctx20.stroke();
    ctx20.closePath();
}



/* given a list of points of either the x or y coordinates,
 * return the dft of the points */
function fourier(points)
{
    let coef = {mag : [], angle : [], freq : []};
    const N = points.length;
    for (let k=0; k<N; k++)
    {
        let real = 0;
        let imag = 0;
        for (let t=0; t<N; t++)
        {
            real += points[t] * Math.cos(2 * Math.PI / N * k * t);
            imag -= points[t] * Math.sin(2 * Math.PI / N * k * t);
        }
        real /= N;
        imag /= N;
        coef.mag.push(Math.sqrt(real * real + imag * imag));
        coef.angle.push(Math.atan2(imag, real));
        coef.freq.push(k);
    }
    return coef;
}


/* draw the epicycles. Offset(x and y params) needed for the y dft to draw appropiately */
function epicycles(x, y, coef, offset, time)
{
    const N = coef.mag.length;
    for (let i=0; i<N; i++)
    {
        let xprev = x;
        let yprev = y;
        x = coef.mag[i] * Math.cos(coef.angle[i] + coef.freq[i] * time + offset) + xprev;
        y = coef.mag[i] * Math.sin(coef.angle[i] + coef.freq[i] * time + offset) + yprev;

        ctx21.beginPath();
        ctx21.arc(xprev, yprev, Math.sqrt((x-xprev)*(x-xprev)+(y-yprev)*(y-yprev)), 0, Math.PI * 2);
        ctx21.strokeStyle = 'rgba(255,255,255,.3)';
        ctx21.stroke();

        ctx21.beginPath();
        ctx21.strokeStyle = 'rgba(255,255,255,1)';
        ctx21.moveTo(xprev, yprev); 
        ctx21.lineTo(x, y);
        ctx21.stroke();
    }
    return {x : x, y : y};
}


/* path: path to redraw
 * time: change in time
 * coefx/y: the discrete fourier transformation involving the magnitude
 * angle offset, and the frequecy
 */
function rotate(time, coefx, coefy, path)
{
    ctx21.clearRect(0, 0, canvas2[1].width, canvas2[1].height);

    let vx = epicycles(10, 100, coefx, 0, time);
    let vy = epicycles(100, 10, coefy, Math.PI/2, time);
    let v = {x : vx.x, y : vy.y};
    path.push(v);

    /* redraws sketch assuming that the coordinate system starts at 
     * the epicycle offset */
    ctx21.beginPath();

    ctx21.strokeStyle = 'rgba(255,255,255,1)';
    ctx21.moveTo(vx.x, vx.y);
    ctx21.lineTo(v.x, v.y);
    ctx21.moveTo(vy.x, vy.y);
    ctx21.lineTo(v.x, v.y);

    for (let i=path.length-1; i>=1; i--)
    {
        ctx21.moveTo(path[i].x, path[i].y);
        ctx21.lineTo(path[i-1].x, path[i-1].y);
    }
    ctx21.stroke();

    if (time < 2 * Math.PI)
    {
        window.requestAnimationFrame(function () {
            rotate(time + 2 * Math.PI / coefx.mag.length, coefx, coefy, path);
        });
    }
    else
    {
        line = {xs : [], ys : [], marking : false}; // reset
    }
}
        
















