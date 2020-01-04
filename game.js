
console.log("Hey");

//canvas stuff
let canvas = document.getElementById("frame");
let ctx = canvas.getContext("2d");
let keys = [];

//ball x,y and dx,dy(how fast they move)
let ball = {
	x: 100,
	y: 250,
	r : 10,
	dx: 2,
	dy: 2
};

//the player
let player = {
	r: 40,
	x: 100,
	y: 100,
	speed: 3
};

//initilize player
ctx.beginPath();
ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI);
ctx.stroke();

//key events
document.onkeydown = function(e) {
	keys[e.keyCode] = true;
};

document.onkeyup = function(e) {
	keys[e.keyCode] = false;
};

//updates character movement
function update(){
	if(keys[37]){
        player.x -= player.speed;
	}
    if(keys[38]){
        player.y -= player.speed;
	}
	if(keys[39]){
        player.x += player.speed;
	}
	if(keys[40]){
        player.y += player.speed;
	}
	ctx.beginPath();
	ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI);
	ctx.stroke();
}

function check_collision(){
	if(ball.y + ball.r > player.y - player.r
	&& ball.y < player.y + player.r
	&& ball.x - ball.r < player.x + player.r
	&& ball.x + ball.r > player.x - player.r){
		if(Math.abs(ball.x - player.x) > Math.abs(ball.y - player.y)){
			ball.dx = -ball.dx;
		}
		else{
			ball.dy = -ball.dy;
		}

	}



}

//updates bouncy ball
function bounce(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.stroke();
    ball.x += ball.dx;
    ball.y += ball.dy;
    if(ball.x - ball.r < 0 || ball.x + ball.r > canvas.width){
    	ball.dx = -ball.dx;
    }
    if(ball.y - ball.r < 0 || ball.y + ball.r > canvas.height){
    	ball.dy = -ball.dy;
    }
    update();
    check_collision();
}

setInterval(bounce, 10);//call bounce every 10ms


