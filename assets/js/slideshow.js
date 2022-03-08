let slides = document.querySelectorAll('.slide-wrapper');
let buttons = document.querySelectorAll('.slide-btn');
let current = 0;


setInterval(() => {

    current < 300 ?  current += 100 : current = 0;

    slides.forEach(slide => {
        slide.style.transform = `translateX(-${current}%)`;
    })

    buttons.forEach((btn,index) => {
        btn.style.backgroundColor = `rgba(187, 187, 187, 0.658)`;
        if(current/100 == index){
            btn.style.backgroundColor = `rgb(223, 223, 223)`;
        }
    })

}, 6500);
