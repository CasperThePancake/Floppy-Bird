//GAME VARIABLES
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
var x = 20
var y = 0
var velocityX = 0
var velocityY = 0
var btUp = false;
var btSpace = false;
var up = 0;
var pipeTick = 400
var speed = 5
var gap = 400
var playing = true

//GAME CLASSES

class Player {
    constructor(x,y,width,height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    draw() {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}

class PipeTop {
    constructor(x,y,width,height,color,passed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.passed = passed
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}

class PipeDown {
    constructor(x,y,width,height,color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}

class Background {
    constructor(color) {
        this.color = color
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(0,0,canvas.width,canvas.height)
    }
}

class Score {
    constructor(score) {
        this.score = score
    }
    draw() {
        ctx.fillStyle = 'gold'
        ctx.font = "bold 48px Roboto";
        ctx.fillText(this.score,5,45)
        if (!playing) {
            ctx.fillStyle = 'red'
            ctx.font = "bold 24px Roboto";
            ctx.fillText("Press SPACE to retry",5,80)
        }
    }
}

//CREATE CONSTANTS FROM CLASSES

const bird = new Player(x,y,25,25,10)
const score = new Score(0)
const background = new Background("lightblue")
var pipes = []

//FRAME CODE

function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    background.draw()
    bird.draw()
    for (element of pipes) {
        element.draw()
    }
    score.draw()
    if (playing) {
        if (btUp) up += 1
        if (!btUp) up = 0
        if (up == 1) velocityY = -2.5
        //VELOCITY AND COORDINATES
        x += velocityX
        y += velocityY
        velocityY += 0.05
        if (y > canvas.height - bird.height) playing = false
        if (y < 0) y = 0
        //APPLY THEM
        bird.x = x
        bird.y = y
        //UPDATE PIPES
        updatePipes()
        //PIPE COLLISION
        pipeCollision()
        //NEW PIPES
        pipeTick += 1
        if (pipeTick > gap) newPipes()
        //SPEED THING
        speed += 0.00025
        gap = 3000 / speed
    } else if (btSpace) restart()
    requestAnimationFrame(update)
}

//BUTTON INPUT

document.onkeydown = function (e) {
    switch (e.keyCode) {
    case 38:
        btUp = true;
        break;
    case 32:
        btSpace = true;
        break;
}
}
document.onkeyup = function (e) {
    switch (e.keyCode) {
    case 38:
        btUp = false;
        break;
    case 32:
        btSpace = false;
        break;
    }
}

//OTHER FUNCTIONS

function updatePipes() {
    for (element of pipes) {
        element.x -= speed / 20
        if (element.x < 0 - element.width) {    
            pipes.splice(0,1)
        }
    }
}

function newPipes() {
    pipeTick = 0
    let randY = randInt(200,400)
    pipes.push(new PipeDown(canvas.width,randY,40,400,"lime"))
    let otherY = randY - randInt(500,600)
    pipes.push(new PipeTop(canvas.width,otherY,40,400,"lime",0))
}

function pipeCollision() {
    for (element of pipes) {
        //HIT DETECTION
        if (x + bird.width > element.x && x < element.x + element.width && y + bird.height > element.y && y < element.y + element.height) {
            element.color = 'red'
            playing = false
        }
        //SCORE UPDATE
        if (x + bird.width > element.x + element.width / 2) {
            if (element.passed == 0) {
            element.passed = 1
            score.score += 1
            }
        }
    }
}

function randInt(min, max) {
    return Math.random() * (max - min) + min;
}

function restart() {
    //RESET ALL VARIABLES
    x = 20
    y = 0
    velocityX = 0
    velocityY = 0
    pipeTick = 400
    speed = 5
    gap = 400
    playing = true
    pipes = []
    score.score = 0
}

//RUN THE FIRST FRAME
update()