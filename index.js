
let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth * .8;
canvas.height = window.innerHeight * .6;

let trash_img = new Image();
let trash = {x : canvas.width - 60, y : canvas.height - 50, w : 60, h : 50};
let paper = {x : 20, y : canvas.height - 40, w : 20, h : 20, shooting : false, angle : 0, xspeed : 0, yspeed : 0, mag : 0, rspeed : 0};
let arrow = {x1 : paper.x + paper.w, y1 : paper.y};
arrow.x2 = arrow.x1;
arrow.y2 = arrow.y2;
let windspeed = Math.floor(10 * Math.random());
let score = 0;
document.getElementById('score').innerHTML = "Score: " + score;


function init()
{
    let ctx = canvas.getContext('2d');
    trash_img.onload = function(){
        ctx.drawImage(trash_img, trash.x, trash.y, trash.w, trash.h);
    };
    trash_img.src = 'trashbin.png';
    window.requestAnimationFrame(draw);
    canvas.addEventListener('mousemove', e => {
        arrow.x2 = e.offsetX;
        arrow.y2 = e.offsetY;
        paper.angle = Math.atan2(arrow.y1 - arrow.y2, arrow.x2, arrow.x1);
        paper.mag = Math.floor(Math.pow(arrow.y1 - arrow.y2, 2) + Math.pow(arrow.x2 - arrow.x1, 2)) / 10000; // heuristics
    });
    canvas.addEventListener('mouseup', e => {
        if(!paper.shooting)
        {
            paper.shooting = true;
            // not y2 - y1 since canvas coordinate system is 0,0 top left
            paper.angle = Math.atan2(arrow.y1 - arrow.y2, arrow.x2, arrow.x1);
            paper.mag = Math.floor(Math.pow(arrow.y1 - arrow.y2, 2) + Math.pow(arrow.x2 - arrow.x1, 2)) / 10000; // heuristics
            paper.xspeed = paper.mag * Math.cos(paper.angle);
            paper.yspeed = paper.mag * Math.sin(paper.angle);
            paper.rspeed = 2;
        }
    });
}


prev_time = 0.0
function draw(tFrame)
{
    window.requestAnimationFrame(draw);
    let ctx = canvas.getContext('2d');
    dt = tFrame - prev_time;
    if(dt >= 33) // milliseconds, 30 FPS
    {
        prev_time = tFrame;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.font = '20px serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        let size = ctx.measureText('Wind: 60 MPH');
        ctx.fillText(`${Math.floor(1000/(dt))}  FPS`, 10, 20);
        ctx.fillText(`Wind: ${windspeed} MPH`, canvas.width - size.width - 10, 20);
        ctx.font = '10px serif';
        ctx.fillText(`Power: ${paper.mag}, Angle: ${Math.floor(paper.angle * 180 / 3.14)}`, 10, canvas.height - 10);
        ctx.restore();

        ctx.drawImage(trash_img, trash.x, trash.y, trash.w, trash.h);

        if(paper.shooting)
        {
            paper.x += paper.xspeed; // assumed each call to draw is 1 second
            paper.y -= paper.yspeed;
            let drag = windspeed * paper.w * paper.h / 1000000; // heuristics
            paper.xspeed -= drag * paper.xspeed * paper.xspeed;
            paper.yspeed -= .2 + drag * paper.yspeed * paper.yspeed; // heuristically found that .2 is good accerlation
            paper.rspeed += .2;
            if(paper.y > canvas.height || paper.x < 0 || paper.x > canvas.width) // bounds check, no roof
            {
                reset();
            }
            else if(paper.x + paper.w/2 > trash.x && paper.x + paper.w/2 < trash.x + trash.w
                && paper.y > trash.y + paper.h) // 30 since trash_img has a lot of transparent space 
            {
                alert("Made it!")
                score += 1;
                document.getElementById('score').innerHTML = "Score: " + score;
                reset();
            }
        }
        ctx.save();
        ctx.translate(paper.x, paper.y);
        ctx.rotate(paper.rspeed);
        ctx.fillRect(-paper.w / 2, -paper.h / 2, paper.w, paper.h);
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(arrow.x1, arrow.y1);
        ctx.lineTo(arrow.x2, arrow.y2);
        ctx.stroke();
    }
}

function reset()
{
    paper.shooting = false;
    paper.x = paper.w;
    paper.y = canvas.height - 2 * paper.h;
    windspeed = Math.floor(10 * Math.random());
    paper.rspeed = 0;
}

init();



