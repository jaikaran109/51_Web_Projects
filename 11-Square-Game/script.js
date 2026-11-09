let s1 = document.getElementById("sq1");
let aboutOverlay = document.getElementById("about-overlay");
let aboutBtn = document.getElementById("about-btn");
let main = document.getElementById("main");
let aboutClose = document.getElementById("about-close");
const defaultBg = "rgba(255, 255, 255, 0.06)";

aboutBtn.addEventListener('click',(e)=>{
    aboutOverlay.classList.add("show");
    main.classList.add("blurred");
})

if(aboutClose){
    aboutClose.addEventListener('click',(e)=>{
    aboutOverlay.classList.remove("show");
    main.classList.remove("blurred");
    })
}

s1.addEventListener("mouseenter",function(){
    let r = Math.floor(Math.random()*100);
    s1.innerHTML = `<h1>${r}</h1>`;
});
s1.addEventListener("mouseleave",function(){
    s1.innerHTML = `<h1>1</h1>`;
});


// new event Listener -- if u double click on box 1 then color also change
s1.addEventListener("dblclick",function(){
    let r1 = Math.floor(Math.random()*256);
    let r2 = Math.floor(Math.random()*256);
    let r3 = Math.floor(Math.random()*256);
    s1.style.backgroundColor = `rgb(${r1},${r2},${r3})`;
});
s1.addEventListener("mouseleave",function(){
    s1.style.backgroundColor = defaultBg;
});





let s2 = document.getElementById("sq2");
let clr = "green";
s2.addEventListener("mouseenter",function(){
    if(clr == "green"){
        s2.style.backgroundColor = "green";
        clr = "red";
    }else {
        s2.style.backgroundColor = "red";
        clr = "green";
    }
});
s2.addEventListener("mouseleave",function(){
    s2.style.backgroundColor = defaultBg;
});



// rgb(a,b,c) where a , b , c lies bw 0 to 255
let s3 = document.getElementById("sq3");
s3.addEventListener("mouseenter",function(){
    let r1 = Math.floor(Math.random()*256);
    let r2 = Math.floor(Math.random()*256);
    let r3 = Math.floor(Math.random()*256);
    s3.style.backgroundColor = `rgb(${r1},${r2},${r3})`;
});
s3.addEventListener("mouseleave",function(){
    s3.style.backgroundColor = defaultBg;
});




let s4 = document.getElementById("sq4");
s4.addEventListener("click",function(){
    let r1 = Math.floor(Math.random()*256);
    let r2 = Math.floor(Math.random()*256);
    let r3 = Math.floor(Math.random()*256);
    s1.style.backgroundColor = `rgb(${r1},255,255)`;
    s2.style.backgroundColor = `rgb(255,${r2},255)`;
    s3.style.backgroundColor = `rgb(255,255,${r3})`;
});
s4.addEventListener("mouseleave",function(){
    s1.style.backgroundColor = defaultBg;
    s2.style.backgroundColor = defaultBg;
    s3.style.backgroundColor = defaultBg;    
});
