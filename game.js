
let gameSeq = [];
let userSeq = [];

let startGame = false;

let level = 0;

let high_score = 0


let btns = ['red','green','yellow','blue'];

let h3 = document.querySelector('h3');



let allBtn = document.querySelectorAll('.b1');

function reset(){
    startGame = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

function wrong(){
    let body = document.querySelector('body');
    let detail = document.querySelector('h3');
    detail.innerText = `Game Over, Your Score Is ${level}
    Press any key to restart `;
    body.style.backgroundColor = "red";
    if(level > high_score){
        high_score = level;
    }
    let h2 = document.querySelector('h2');
    h2.innerText = `High Score = ${high_score}`;
    // console.log(high_score);
    reset();
    
}


function random(){
    let num = Math.floor(Math.random()*4);
    return num;
}

document.addEventListener('keypress', function(){
    if(startGame == false){
        // console.log('Game Started');
        startGame = true;
        let body = document.querySelector('body');
        body.style.backgroundColor = "White";
        levelUp();
    }
});

function levelUp(){
    userSeq = [];
    level++;
    h3.innerText = `Level ${level}`;

    let randomIdx = random();
    let randomColor = btns[randomIdx];
    let randomBtn = document.querySelector(`.${randomColor}`);

    // console.log(randomIdx);
    // console.log(randomColor);
    // console.log(randomBtn);

    gameSeq.push(randomColor);

    flash(randomBtn);
}

function flash(btn){
    btn.classList.add('flash');
    setTimeout(function (){
        btn.classList.remove('flash');
        // console.log("flashed");
    },200);
}
function userflash(btn){
    btn.classList.add('userflash');
    setTimeout(function (){
        btn.classList.remove('userflash');
        // console.log("flashed");
    },200);
}

function check(idx){
    console.log('Checked');
    if(gameSeq[idx]==userSeq[idx]){
        if(gameSeq.length==userSeq.length){
            setTimeout(levelUp,1000);
        }
    }else{
        wrong();
    }
}

function click(){
    console.log('button clicked');
    userflash(this);
    userColor = this.getAttribute('id');
    // console.log(userColor);
    userSeq.push(userColor);
    console.log(userSeq);
    check(userSeq.length-1);
}
for(btn of allBtn){
    btn.addEventListener('click',click);
}