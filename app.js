// Making audios
let btnClickAudio = new Audio('./audios/btnClickAudio.mp3'),
    bgAudio = new Audio('./audios/bgAudio.mp3'),
    gameLossAudio = new Audio('./audios/gameLossAudio.mp3');

// Targeting DOM Elements
let playBtn = document.querySelector("#playBtn"),
    playAndMuteBtn = document.querySelector("#play-mute"),
    popupCover = document.querySelector(".popup-cover"),
    welcomePopup = document.querySelector("#welcome-popup"),
    namePopup = document.querySelector("#name-popup"),
    addNameBtn = document.querySelector("#addNameBtn"),
    playerNameInput = document.querySelector("#player-name-input"),
    greetingPlayer = document.querySelector("#greetingPlayer"),
    animatedGameHeadingCover = document.querySelector(".animated-game-name-cover"),
    levels = document.querySelectorAll(".levels button"),
    timer = document.querySelector("#timer-countdown"),
    startCountdown = document.querySelector(".start-countdown p"),
    gameRestartBtn = document.querySelector(".gameRestartBtn"),
    goToStartBtn = document.querySelector(".goToStartBtn")
    canvas = document.querySelector("canvas"),
    gameEndPopUp = document.querySelector(".game-end-popup"),
    gameLossDiv = document.querySelector(".game-loss"),
    gameWonDiv = document.querySelector(".game-win");

// Global Variables
let disabledLevels,
    timerInterval,
    animationFrame,
    currentSelectedlevel,
    startCountdownextreme,
    currentSelectedlevelTime,
    ctx = canvas.getContext("2d");
    
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Event Listeners
playBtn.addEventListener("click", () => {
    btnClickAudio.currentTime = 0;
    btnClickAudio.play();

    // Making Welcome Popup Hidden and Showing Name Popup
    welcomePopup.classList.add("popup-hidden");
    namePopup.classList.remove("popup-hidden");

    setTimeout(() => {
        bgAudio.volume = 0.6;
        bgAudio.loop = true;
        bgAudio.play();
    }, 900);
});

playAndMuteBtn.addEventListener("click", () => {
    let playAndMuteBtnIcon = document.querySelector("#play-mute i");
    if (playAndMuteBtnIcon.classList.contains("bi-volume-up-fill")) {
        playAndMuteBtnIcon.classList.remove("bi-volume-up-fill");
        playAndMuteBtnIcon.classList.add("bi-volume-mute-fill");
        bgAudio.volume = 0;
    } else {
        playAndMuteBtnIcon.classList.add("bi-volume-up-fill");
        playAndMuteBtnIcon.classList.remove("bi-volume-mute-fill");
        bgAudio.volume = 0.6;
    }
});

addNameBtn.addEventListener("click", () => {
    if (playerNameInput.value !== "") {
        btnClickAudio.play();
        greetingPlayer.innerText = `Greetings Captain ${playerNameInput.value}`;
        namePopup.classList.add("popup-hidden");
        popupCover.classList.add("popup-cover-hidden");

        setTimeout(() => {
            popupCover.classList.add("popup-cover-none");
            animatedGameHeadingCover.style.display = "flex";
            animatedGameHeadingCover.style.flexDirection = "column";
            animatedGameHeadingCover.children[0].classList.add("animated-game-name-heading");
            animatedGameHeadingCover.children[1].classList.add("animated-game-guideline");
        }, 500);

    } else {
        playerNameInput.style.borderColor = "red";
    }
});

levels.forEach(levelBtn => {
    levelBtn.addEventListener("click", () => {
        let previousSelectedLvl = document.querySelector(".selectedlvl");
        previousSelectedLvl ? previousSelectedLvl.classList.remove("selectedlvl") : "";
        levelBtn.classList.add("selectedlvl");
        disabledLevels = document.querySelectorAll(".levels button:not(.selectedlvl)");
        disabledLevels.forEach(disabledLevel => {
            disabledLevel.setAttribute("disabled", "disabled");
        });
        animatedGameHeadingCover.style.display = "none";
        currentSelectedlevel = document.querySelector(".selectedlvl").innerText;
        currentSelectedlevelTime = +(currentSelectedlevel.split("").splice(0, currentSelectedlevel.length - 1).join(""));
        if (currentSelectedlevelTime <= 9) {
            timer.innerText = "00:0" + currentSelectedlevelTime;
        } else {
            timer.innerText = "00:" + currentSelectedlevelTime;
        };

        startCountdown.parentElement.style.display = "flex";
        startCountdownextreme = 3;
        startCountdown.innerText = startCountdownextreme;
        let countdownInterval = setInterval(() => {
            if (startCountdownextreme >= 1) {
                startCountdownextreme--;
                startCountdown.innerText = startCountdownextreme;
            } else {
                startCountdown.parentElement.style.display = "none";
                canvas.style.opacity = 1;
                planet.dy = planet.speed;
                clearInterval(countdownInterval);
                timerInterval = setInterval(() => {
                    currentSelectedlevelTime--;
                    if (currentSelectedlevelTime >= 10) {
                        timer.innerText = "00:" + currentSelectedlevelTime;
                    } else if (currentSelectedlevelTime < 10 && currentSelectedlevelTime >= 0) {
                        timer.innerText = "00:0" + currentSelectedlevelTime;
                    } else {
                        clearInterval(timerInterval);
                        disabledLevels.forEach(disabledLevel => {
                            disabledLevel.removeAttribute("disabled");
                        });
                        document.querySelector(".selectedlvl").classList.remove("selectedlvl");
                        gameEndPopUp.classList.add("game-end-popup-visible");
                        gameLossDiv.classList.contains("game-result-visible") ? gameLossDiv.classList.remove("game-result-visible") : "";
                        gameWonDiv.classList.add("game-result-visible");
                    };
                }, 1000);
            }
        }, 1000);
        planet.y = 255;
        planet.dy = 0;
        update();
    });
});

gameRestartBtn.addEventListener("click", () => {
    btnClickAudio.currentTime = 0;
    btnClickAudio.play();
    timer.innerText = "00:00";
    clearInterval(timerInterval);
    disabledLevels.forEach(disabledLevel => {
        disabledLevel.removeAttribute("disabled");
    });
    document.querySelector(".selectedlvl").classList.remove("selectedlvl");
    gameEndPopUp.classList.remove("game-end-popup-visible");
    gameWonDiv.classList.remove("game-result-visible");
    animatedGameHeadingCover.style.display = "flex";
    animatedGameHeadingCover.style.flexDirection = "column";
    animatedGameHeadingCover.children[0].classList.add("animated-game-name-heading");
    animatedGameHeadingCover.children[1].classList.add("animated-game-guideline");
});

goToStartBtn.addEventListener("click", () => {
    btnClickAudio.currentTime = 0;
    btnClickAudio.play();
    gameEndPopUp.classList.remove("game-end-popup-visible");
    gameWonDiv.classList.remove("game-result-visible");
    animatedGameHeadingCover.style.display = "flex";
    animatedGameHeadingCover.style.flexDirection = "column";
    animatedGameHeadingCover.children[0].classList.add("animated-game-name-heading");
    animatedGameHeadingCover.children[1].classList.add("animated-game-guideline");
});
// Canvas Working
// Adding Planet image to canvas
const planetImage = document.querySelector("#planetImage")

const planet = {
    width: 60,
    height: 60,
    x: 595,
    y: 225,
    speed: 5,
    dy: 0,
};

function drawPlanet() {
    ctx.drawImage(planetImage, planet.x, planet.y, planet.width, planet.height);
}

function newPosition() {
    planet.y += planet.dy;
}

function decideGameLossOrWin() {
    canvas.style.opacity = 0;
    cancelAnimationFrame(animationFrame);
    gameEndPopUp.classList.add("game-end-popup-visible");
    if (currentSelectedlevelTime > 0) {
        gameLossDiv.classList.add("game-result-visible");
        clearInterval(timerInterval);
    } else {
        gameWonDiv.classList.add("game-result-visible");
    }
}
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlanet();
    newPosition();

    animationFrame = requestAnimationFrame(update);

    // Detect top and bottom walls and showing game over popup
    if (planet.y + planet.height > canvas.height + 12) {
        planet.y = canvas.height - 50;
        planet.dy = canvas.height - 50;
        if(!gameWonDiv.classList.contains("game-result-visible")){
            gameLossAudio.play();
        }
        decideGameLossOrWin();
    }
    else if (planet.y - planet.height < -64) {
        planet.y = -10;
        planet.dy = -10;
        if(!gameWonDiv.classList.contains("game-result-visible")){
            gameLossAudio.play();
        }
        decideGameLossOrWin();
    }
}

// Canvas Event Listeners
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && planet.y != canvas.height - 50 && currentSelectedlevelTime != undefined && startCountdownextreme === 0) {
        planet.dy = -planet.speed;
    } else if (e.key === "ArrowDown" && currentSelectedlevelTime != undefined && startCountdownextreme === 0) {
        planet.dy = planet.speed;
    }
});