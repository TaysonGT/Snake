let gameArea = document.querySelector('.game-area')
let btns = document.querySelectorAll('button')
let score = 0
let heighest = score;
let started = false;
let lost = false;
let glowCheck = true
let snake = []
let apple = {}


// ----------------- INITIAL DOM PREPARATION ----------------- //
for(var y=1; y<=16;y++){
    for(var x=1; x<=16; x++){
        let tile = document.createElement('div')
        tile.setAttribute('id', `x${x}-y${y}`)
        tile.setAttribute('class', `tile`)
        gameArea.appendChild(tile)
    }
}
document.querySelector('.score').innerHTML = `Score: ${score}`
document.querySelector('.heighest').innerHTML = `Record: ${heighest}`


// ----------------- START EVENT ----------------- //
document.querySelector('.start').addEventListener('click', ()=>{
    const tl = gsap.timeline({defaults:{ duration: .4, ease: "power3.in" }})
    tl.to('.dialogue', { opacity: 0, scale: .3, onComplete: startGame})
    tl.to('.dialogue', { display: 'none'})
})

// ------------------- CONTROLS ------------------- //
for(let x=0;x<btns.length;x++){
    btns[x].addEventListener('click', function(){
        switch(btns[x].id){
            case 'up':
                if(snake[0].position.x-snake[1].position.x!=0)snake[0].direction=12;
                break;
            case 'down':
                if(snake[0].position.x-snake[1].position.x!=0)snake[0].direction=6; 
                break;
            case 'left':
                if(snake[0].position.y-snake[1].position.y!=0)snake[0].direction=9;
                break;
            case 'right':
                if(snake[0].position.y-snake[1].position.y!=0)snake[0].direction=3;
                break;
        }
    })
}

// MODIFYING CONTROLS
function ctrlLeft(){
    document.querySelector('.controls').classList.remove('right')
    document.querySelector('.controls').classList.add('left')
}
function ctrlRight(){
    document.querySelector('.controls').classList.remove('left')
    document.querySelector('.controls').classList.add('right')
}
function ctrlMid(){
    document.querySelector('.controls').classList.remove('left', 'right')
}


function startGame(){
    snakeGenerator();
    appleGenerator();
    myInterval = setInterval(run, 500)
}

function appleGenerator(){
    let done = false
    while(!done){
        done = true
        apple.x = Math.ceil(Math.random()*16);
        apple.y = Math.ceil(Math.random()*16);
        
        // CHECK IF NOT SPAWN BELOW SNAKE
        for(let x=0;x<snake.length;x++){
            if((snake[x].position.x == apple.x)&&(snake[x].position.y==apple.y)){
                done = false
            }
        }
    }
}

function snakeGenerator(){
    // EMPTY SNAKE
    snake = []
    
    // SNAKE HEAD
    let head = {
        direction: Math.ceil(Math.random()*4)*3,
        prevDirection: null,
        position: {
            x: Math.ceil(Math.random()*16),
            y: Math.ceil(Math.random()*16)
        }
    }
    snake.push(head)
    
    // OTHER BITS FOLLOW
    for(let x=1;x<=2;x++){
        let newBit = {
            direction: snake[snake.length-1].direction,
            prevDirection: null,
            position:{}
        }
        switch(snake[snake.length-1].direction){
            case 12:
                newBit.position.y = snake[snake.length-1].position.y+1;
                newBit.position.x = snake[snake.length-1].position.x;
                break;
            case 3:
                newBit.position.x = snake[snake.length-1].position.x-1;
                newBit.position.y = snake[snake.length-1].position.y;
                break;
            case 6:
                newBit.position.y = snake[snake.length-1].position.y-1;
                newBit.position.x = snake[snake.length-1].position.x;
                break;
            case 9:
                newBit.position.x = snake[snake.length-1].position.x+1;
                newBit.position.y = snake[snake.length-1].position.y;
                break;
        }
        snake.push(newBit)
    }
}


function run(b){
    for(let x=0;x<snake.length;x++){
        // --------- MOVEMENT --------- //
        switch(snake[x].direction){
            case 12: 
                snake[x].position.y--;
                break;
            case 3:
                snake[x].position.x++;
                break;
            case 6:
                snake[x].position.y++;
                break;
            case 9:
                snake[x].position.x--;
                break;
        }
        
        // LOSING WHEN BITING SELF
        if(snake[x].position.x==snake[0].position.x &&  snake[x].position.y == snake[0].position.y && x!=0){
            lost=true
        }
    }
    
    // LOSING WHEN HITTING BORDERS
    if(snake[0].position.x<=0||snake[0].position.x>16 ||snake[0].position.y<=0||snake[0].position.y>16){
        lost = true
    }
    
    // EVERY BIT FOLLLOWS THE ONE ABOVE 
    for(let b=snake.length-1;b>0;b--){
        snake[b].prevDirection=snake[b].direction;
        snake[b].direction=snake[b-1].direction;
    }

    // PICKED APPLE
    if(document.querySelector(`#x${snake[0].position.x}-y${snake[0].position.y}`)==document.querySelector(`#x${apple.x}-y${apple.y}`)){
        let lastBit = snake[snake.length-1];
        let newBit = {
            direction: snake[snake.length-1].prevDirection,
            prevDirection: null,
            position:{}
        }
        
        // NEW BIT ADDITION
        switch(lastBit.prevDirection){
            case 9:
                newBit.position.x = lastBit.position.x+1;
                newBit.position.y = lastBit.position.y;
                break;
            case 3:
                newBit.position.x = lastBit.position.x-1;
                newBit.position.y = lastBit.position.y;
                break;
            case 6:
                newBit.position.y = lastBit.position.y-1;
                newBit.position.x = lastBit.position.x;
                break;
            case 12:
                newBit.position.y = lastBit.position.y+1;
                newBit.position.x = lastBit.position.x;
                break;
        }
        snake.push(newBit)
        score++;
        document.querySelector('.score').innerHTML = `Score: ${score}`
        appleGenerator();
    }
    
    // RESETING AFTER LOSS
    if(lost){
        alert('YOU LOST')
        started= false;
        lost = false;
        clearInterval(myInterval)
        if(score > heighest){
            heighest = score;
            document.querySelector('.heighest').innerHTML = `Record: ${heighest}`
        }
        score = 0
        document.querySelector('.score').innerHTML = `Score: ${score}`
        resetTiles()
        gsap.fromTo('.dialogue', { opacity: 0, display: 'block', scale: .3}, {opacity:1, duration: .75, ease: "elastic(1.5)", scale: 1})
    }
    
    updateColors();
}

function updateColors(){
    // APPLE COLOR & GLOW
    document.querySelector(`#x${apple.x}-y${apple.y}`).style.backgroundColor = 'red'
    if(glowCheck){
        document.querySelector(`#x${apple.x}-y${apple.y}`).style.boxShadow = '0 0 10px rgb(255 0 0 / 50%)'
        glowCheck= false;
    }else{
        document.querySelector(`#x${apple.x}-y${apple.y}`).style.boxShadow = '0 0 30px rgb(255 0 0 / 90%)'
        glowCheck=true
    }
    
    // RESET TILES COLORS AFTER MOVEMENTS
    let tiles = document.querySelectorAll('.tile')
    for(let x=0;x<tiles.length;x++){
        // EXCLUDING APPLE COLOR FROM BEING RESET
        if(tiles[x]!=document.querySelector(`#x${apple.x}-y${apple.y}`)){
            tiles[x].style.background='transparent'
            tiles[x].style.boxShadow='none'
        }
    }
    
    // SNAKE COLOR WITH GRADIENT DEPENDING ON BITS ORDER
    for(let x=0;x<snake.length;x++){
        let percent = Math.floor(((snake.length-x)/snake.length)*85);
        document.querySelector(`#x${snake[x].position.x}-y${snake[x].position.y}`).style.backgroundColor = `rgba(20, 230, 160, ${percent+15}%)`;
    }
}

function resetTiles(){
    let tiles = document.querySelectorAll('.tile')
    for(let x=0;x<tiles.length;x++){
        tiles[x].style.background='transparent'
        tiles[x].style.boxShadow='none'
    }
}