var imagesBg = new Array()
	function preload() {
		for (i = 0; i < preload.arguments.length; i++) {
			imagesBg[i] = new Image()
			imagesBg[i].src = preload.arguments[i]
		}
}

preload(
	"card-back.png",
    "bg.svg",
    "leaves-01.svg"
);

let group1 = new Array();
let group2 = new Array();
let timer;
let moves = 0;
let movesTotal = 3;
let startScreen = document.querySelector(".start-screen");
let header = document.querySelector(".default");
let allCards;
let leftCards;
let nextLevelScreen = document.querySelector(".next-level-screen"); 
let timeUp = document.querySelector(".time-is-up");
let movesOver = document.querySelector(".moves-out");
let table = document.querySelector("#table");
let endGame = document.querySelector(".end-game");


let secondsArray = [15, 25, 25, 30, 30, 50, 50, 10, 10, 20, 20, 30, 40, 50, 0];
let minutesArray = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2];
let defaultTime = 0;
let level = 1;
let numCards;

//Tilt effect
let startCard = document.querySelector(".start-card");
startCard.addEventListener("mousemove", tiltEffect);
startCard.addEventListener("mouseleave", stopTilt);
startCard.addEventListener("mouseenter", enterTilt);

function enterTilt(event) {
    setTransition();
}

function tiltEffect(event) {
    const cardWidth = startCard.offsetWidth;
    const cardHeight = startCard.offsetHeight;
    const centerX = startCard.offsetLeft + cardWidth/5;
    const centerY = startCard.offsetTop + cardHeight/5;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    const rotateX = 15 * mouseY/(cardHeight/2);
    const rotateY = -15 * mouseX/(cardWidth/2);
    startCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function stopTilt(event){
    startCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    setTransition();
}

function setTransition() {
    clearTimeout(startCard.transitionTimeout);
    startCard.style.transition = "transform 300ms cubic-bezier(.03, .98, .52, .99)";
    startCard.transitionTimeout = setTimeout(() => {
        startCard.style.transition = "";
    }, 3000); 
}

//Create cards
function createCards() {
    group1.length = 0;
    group2.length = 0;

    for (let i = 0; i < numCards; i++) {
        group1[i] = document.createElement("img");
        group1[i].src = `cards/img-${i+1}.png`;
    }
        
    for (let i = 0; i < numCards; i++) {
        group2[i] = document.createElement("img");
        group2[i].src = `cards/img-${i+1}.png`;
    } 
    allCards= group1.concat(group2);
}

//shuffle
function shuffleCards() {
    let result = allCards.sort(function() {
        return 0.5 - Math.random(); 
    });
    return result;
}

function start() {
    firstLevelCards();
    dealCards();
    defaultTime = 0;
}

function next(){
    nextLevelcards();
    defaultTime++;
    dealCards();
}

function retry() {
    retryLevelCards();
    dealCards();
}

function firstLevelCards(){
    level = 1;
    moves = 0;
    movesTotal = 3;
    document.querySelector("#mov-total").innerText = movesTotal;
    numCards = 2;
    createCards();
}

function nextLevelcards(){
    level++;
    moves = 0;
    movesTotal = movesTotal + 3;
    document.querySelector("#mov-total").innerText = movesTotal;
    numCards++;
    createCards();
}

function retryLevelCards(){
    moves = 0;
    document.querySelector("#mov").innerText = 0;
    document.querySelector("#mov-total").innerText = movesTotal;
    createCards();
}

function dealCards() {
    table.style.display = "flex";
    timeUp.style.display = "none";
    movesOver.style.display = "none";
    header.style.display = "block";
    nextLevelScreen.style.display = "none";
    startScreen.style.display = "none";
    endGame.style.display = "none";

    document.querySelector("#level").innerHTML = level;
    clearInterval(timer);
    startTimer();
    let shuffledCards = shuffleCards();
    table.innerHTML="";

    //Dealing cards to table
    shuffledCards.forEach(element => {
        let cardBack = document.createElement("img");
        cardBack.src = "card-back.png";

        let card = document.createElement("div");
        card.classList.add("card");
    
        card.innerHTML = 
        "<div class= 'front'>" +
        "</div>" +
        "<div class='back'>" +
        "</div>";
        table.appendChild(card);

        let back = document.getElementsByClassName("back");
        back[back.length-1].appendChild(cardBack);  
        
        let front = document.getElementsByClassName("front");
        front[front.length-1].appendChild(element);  
    });

    //Flip cards when clicking
    function show(){
         let allShown = document.querySelectorAll(".shown:not(.success)");
        if(allShown.length > 1){
            return;
        }
        this.classList.add("shown");
        document.querySelector("#sound-flip").cloneNode().play();

        let cardsShown = document.querySelectorAll(".shown:not(.success)");
        if (cardsShown.length < 2){
            return;
        }
        compare(cardsShown);
        updateCounter();

        setTimeout(function() {
            leftCards = document.querySelectorAll(".card:not(.success)");
            if(leftCards.length===0 && numCards!==6){
                document.querySelector("#sound-level-up").play();
               endLevel();
            } else if (leftCards.length===0 && numCards===6) {
                gameOver();
            }
        }, 2000);
    }

    //compare cards when two open
    function compare(cardsShown){
        let card1 = cardsShown[0].getElementsByTagName('img')[0].src;
        let card2 = cardsShown[1].getElementsByTagName('img')[0].src;

        if(card1 === card2){
            success(cardsShown);
        } else {
            error(cardsShown);
        }
    };

    //Succes
    function success(cardsShown){
        setTimeout(function(){          
            cardsShown.forEach(function(element) {
                element.classList.add("success");
                document.querySelector("#sound-success").cloneNode().play();
            });

        }, 800);
    };

    //Error
    function error(cardsShown){
       setTimeout(function(){          
            cardsShown.forEach(function(element) {
                element.classList.add("error");
                document.querySelector("#sound-error").cloneNode().play();
            });
        }, 500);
     
        setTimeout(function(){          
            cardsShown.forEach(function(element) {
                element.classList.remove("error");
                element.classList.remove("shown");
            });
        }, 1200);
    };

    //
    document.querySelectorAll(".card").forEach(
        function(element){
            element.addEventListener("click", show);
        }
    ); 
}

//Timer
function startTimer(){
    let minutes = minutesArray[defaultTime];
    let seconds = secondsArray[defaultTime];

    document.querySelector("#minutes").innerHTML= minutes;
    document.querySelector("#seconds").innerHTML= seconds;

    if (seconds < 10){
        document.querySelector("#seconds").innerHTML= `0${seconds}`;
    } 
    if (minutes < 10) {
        document.querySelector("#minutes").innerHTML= `0${minutes}`;
    }

    let textSeconds;
    let textMinutes;

    function updateTimer(){
        seconds--;
        if (seconds < 0){
            seconds = 59;
            minutes--;
        }
        if (minutes < 0){
            seconds = 0;
            minutes = 0;
            clearInterval(timer);
        }

        let totalTime = minutes + seconds;
     
        textSeconds = seconds;
        textMinutes = minutes;

        if (seconds < 10){
            textSeconds = `0${seconds}`
        } 
        if (minutes < 10) {
            textMinutes = `0${minutes}`
        }

        document.querySelector("#minutes").innerHTML= textMinutes;
        document.querySelector("#seconds").innerHTML= textSeconds;

        setTimeout(function() {
            if (totalTime === 0 && document.querySelectorAll(".card:not(.success)").length !== 0) {
                setTimeout(function() {
                    document.querySelector("#sound-level-fail").play();
                    timeOver();
                },1000)
            }   
        }, 50);
    }
    timer = setInterval(updateTimer, 1000);
}

//Moves counter
 function updateCounter() {
    moves++;
    document.querySelector("#mov").innerText = moves;
    let left = document.querySelectorAll(".card:not(.success)");

    if (moves === movesTotal && left.length > 2){
        setTimeout(function() {
            document.querySelector("#sound-level-fail").play();
            movesOut();
        },1500);    
    }
}
//Go to Start screen
function goToStartScreen() { 
    table.style.display = "none";
    timeUp.style.display = "none";
    movesOver.style.display = "none";
    header.style.display = "none";
    nextLevelScreen.style.display = "none";
    startScreen.style.display = "flex";
    endGame.style.display = "none";

}

//end game
function endLevel() {
    clearInterval(timer);
    document.querySelector("#mov").innerText = 0;
    nextLevelScreen.style.display = "flex";
    header.style.display = "none";
}

//Time is up
function timeOver() {
    clearInterval(timer);
    document.querySelector("#mov").innerText = 0;
    timeUp.style.display = "flex";
    table.style.display = "none";
    header.style.display = "none";
    movesOver.style.display = "none";
    endGame.style.display = "none";

}

//Moves out
function movesOut() {
    clearInterval(timer);
    document.querySelector("#mov").innerText = 0;
    movesOver.style.display = "flex";
    timeUp.style.display = "none";
    table.style.display = "none";
    header.style.display = "none";
    endGame.style.display = "none";

}

//Start Game
document.querySelector(".start").addEventListener("click", start);
document.querySelector(".next-level-button").addEventListener("click", next);

document.querySelectorAll(".try-again").forEach(element => {
    element.addEventListener("click", retry)
});

document.querySelectorAll(".go-start").forEach(element => {
    element.addEventListener("click", goToStartScreen)
});

function gameOver(){
    document.querySelector("#sound-level-up").play();
    setTimeout(function () {
        movesOver.style.display = "none";
        timeUp.style.display = "none";
        table.style.display = "none";
        header.style.display = "none";
        endGame.style.display = "none";
        endGame.style.display = "flex";
        document.querySelector("#sound-win-game").cloneNode().play();
        textAnimation();  
    },1000);
}

//end screen animation

function textAnimation(){
    let story = document.querySelector(".story");
    let words = story.children;
    let numWords = 85;
    let delayAnimation = 0;

    for (let i = 0; i < numWords; i++) {   
        delayAnimation = delayAnimation + 180;
        words[i].style.animationDelay = `${delayAnimation}ms`;    
    }

    let numLetters = 20;
    let alebrijes = document.querySelector("h1");
    let alebrijesLetters = alebrijes.children;

    for (let i = 0; i < numLetters; i++) {   
        delayAnimation = delayAnimation + 180;
        alebrijesLetters[i].style.animationDelay = `${delayAnimation}ms`;    
    }
}