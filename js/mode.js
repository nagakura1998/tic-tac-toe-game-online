const buttons = document.querySelectorAll('.ripple');
const btnvspc = document.querySelector(".mode-vs-pc");
const btnvsguess = document.querySelector(".mode-vs-guess");

var mode_vs_pc = true;
buttons.forEach(button => {
    button.addEventListener( 'click', function (e){
        const x = e.clientX;
        const y = e.clientY;

        const buttonTop = e.target.offsetTop;
        const buttonLeft = e.target.offsetLeft;

        const xInside = x - buttonLeft;
        const yInside =  y - buttonTop;

        const circle = document.createElement('span');
        circle.classList.add('circle');
        circle.style.top = yInside + 'px';
        circle.style.left = xInside + 'px';

        this.appendChild(circle);

        setTimeout(() => circle.remove(), 500);
    })
});

btnvspc.addEventListener('click', (e)=>{
    e.preventDefault();
    $(".mode-pc").attr("src","img/PC.png");
    //document.getElementById("").src = "img/PC.png";
    mode_vs_pc = true;
    currGame.StopAllTimer();
    ctrl.newGame()
});

btnvsguess.addEventListener('click', (e)=>{
    e.preventDefault();
    $(".mode-pc").attr("src","img/guess.png");
    //document.getElementById("mode-pc").src = "img/guess.png";
    mode_vs_pc = false;
    currGame.StopAllTimer();
    ctrl.newGame()
})