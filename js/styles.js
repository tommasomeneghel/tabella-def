let menu = false;

function setup() {
    let startInterface = document.getElementById("startInterface");
    let gameContainer = document.getElementById("gameContainer");
    document.getElementById("startButton").addEventListener("click", interfaceSwapper); //startbutton functionality hide button
    document.getElementById("startButton").addEventListener("click", init); //startbutton functionality create game
    let menuInterface = document.getElementById("menuInterface");
    document.getElementById("icona-menu").addEventListener("click", svgAnimation);
}

function interfaceSwapper() {
    startInterface.style.display = "none";
    gameContainer.style.display = "unset";
    svgAnimation()
    menu = false

}

function svgAnimation() {
    if (menu) {
        menuInterface.style.display = "none";
        menu = false;
    } else {
        menuInterface.style.display = "unset"
        menu = true;
    }
}