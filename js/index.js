


/* 
 * Following lines of code refer to the game 
 * on the home page section
 */
const wind_canvas = document.getElementById('wind-canvas');
const wind_ctx = wind_canvas.getContext('2d');
const compliment = ['Buckets', 'Made it', 'Nice Shot', 'Ok Ok Ok', 'Woo Back Baby', 'Lets Go', 'Aight Fosho', 'Baaang']
let trash_img = new Image();
let trash = {x : wind_canvas.width - 60, y : wind_canvas.height - 50, w : 60, h : 50};
let paper = {x : 20, y : wind_canvas.height - 40, w : 20, h : 20, shooting : false, angle : 0, xspeed : 0, yspeed : 0, mag : 0, rspeed : 0};
let arrow = {x1 : paper.x + paper.w, y1 : paper.y};
arrow.x2 = arrow.x1;
arrow.y2 = arrow.y2;
let windspeed = Math.floor(10 * Math.random());
let score = 0;

document.getElementById('score').innerHTML = "Score: " + score;


function initGame()
{
    trash_img.onload = function(){
        wind_ctx.drawImage(trash_img, trash.x, trash.y, trash.w, trash.h);
    };
    trash_img.src = 'imgs/trashbin.png';
    window.requestAnimationFrame(draw);
    wind_canvas.addEventListener('mousemove', e => {
        arrow.x2 = e.offsetX;
        arrow.y2 = e.offsetY;
        paper.angle = Math.atan2(arrow.y1 - arrow.y2, arrow.x2, arrow.x1);
        paper.mag = Math.floor(Math.pow(arrow.y1 - arrow.y2, 2) + Math.pow(arrow.x2 - arrow.x1, 2)) / 10000; // heuristics
    });
    wind_canvas.addEventListener('mouseup', e => {
        if(!paper.shooting)
        {
            paper.shooting = true;
            // not y2 - y1 since wind_canvas coordinate system is 0,0 top left
            paper.angle = Math.atan2(arrow.y1 - arrow.y2, arrow.x2, arrow.x1);
            paper.mag = Math.floor(Math.pow(arrow.y1 - arrow.y2, 2) + Math.pow(arrow.x2 - arrow.x1, 2)) / 10000; // heuristics
            paper.xspeed = paper.mag * Math.cos(paper.angle);
            paper.yspeed = paper.mag * Math.sin(paper.angle);
            paper.rspeed = 2;
        }
    });
}


let prev_time = 0.0
function draw(tFrame)
{
    window.requestAnimationFrame(draw);
    dt = tFrame - prev_time;
    if(dt >= 33) // milliseconds, 30 FPS
    {
        prev_time = tFrame;

        wind_ctx.clearRect(0, 0, wind_canvas.width, wind_canvas.height);
        wind_ctx.save();
        wind_ctx.font = '20px serif';
        wind_ctx.fillStyle = 'white';
        wind_ctx.textAlign = 'left';
        let size = wind_ctx.measureText('Wind: 60 MPH');
        wind_ctx.fillText(`${Math.floor(1000/(dt))}  FPS`, 10, 20);
        wind_ctx.fillText(`Wind: ${windspeed} MPH`, wind_canvas.width - size.width - 10, 20);
        wind_ctx.font = '10px serif';
        wind_ctx.fillText(`Power: ${paper.mag}, Angle: ${Math.floor(paper.angle * 180 / 3.14)}`, 10, wind_canvas.height - 10);
        wind_ctx.restore();

        wind_ctx.drawImage(trash_img, trash.x, trash.y, trash.w, trash.h);

        if(paper.shooting)
        {
            paper.x += paper.xspeed; // assumed each call to draw is 1 second
            paper.y -= paper.yspeed;
            let drag = windspeed * paper.w * paper.h / 1000000; // heuristics
            paper.xspeed -= drag * paper.xspeed * paper.xspeed;
            paper.yspeed -= .2 + drag * paper.yspeed * paper.yspeed; // heuristically found that .2 is good accerlation
            paper.rspeed += .2;
            if(paper.y > wind_canvas.height || paper.x < 0 || paper.x > wind_canvas.width) // bounds check, no roof
            {
                reset();
            }
            else if(paper.x + paper.w/2 > trash.x && paper.x + paper.w/2 < trash.x + trash.w
                && paper.y > trash.y + paper.h) // 30 since trash_img has a lot of transparent space 
            {
                alert(compliment[Math.floor(Math.random() * compliment.length)] + '!!!')
                score += 1;
                document.getElementById('score').innerHTML = "Score: " + score;
                reset();
            }
        }
        wind_ctx.save();
        wind_ctx.translate(paper.x, paper.y);
        wind_ctx.rotate(paper.rspeed);
        wind_ctx.fillRect(-paper.w / 2, -paper.h / 2, paper.w, paper.h);
        wind_ctx.restore();

        wind_ctx.beginPath();
        wind_ctx.moveTo(arrow.x1, arrow.y1);
        wind_ctx.lineTo(arrow.x2, arrow.y2);
        wind_ctx.stroke();
    }
}

/*
 * Set the settings to default
 */
function reset()
{
    paper.shooting = false;
    paper.x = paper.w;
    paper.y = wind_canvas.height - 2 * paper.h;
    windspeed = Math.floor(10 * Math.random());
    paper.rspeed = 0;
}

initGame();



























