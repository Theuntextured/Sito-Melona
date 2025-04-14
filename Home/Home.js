
SetupSlides(18);
let slideIndex = 1;
showSlides(slideIndex);

/*
FORMAT:
                <div class="mySlides fade">
                    <div class="numbertext">1 / 3</div>
                    <img src="../Resources/Showcase1.jpg" style="width:100%">
                </div>
                
AND:
                <span class="dot" onclick="currentSlide(3)"></span>
 */

function SetupSlides(ImageCount){
    let Container = document.getElementById("HomePageSlideshowContainer");
    let DotContainer = document.getElementById("HomePageSlideshowDots");
    let FirstArrow = Container.firstChild;
    
    for(let i = 1; i <= ImageCount; i++) {
        let div = document.createElement("div");
        div.classList.add("mySlides");
        div.classList.add("fade");
        let NumberText = document.createElement("div");
        let img = document.createElement("img");
        img.src = "../Resources/Showcase" + i.toString() + ".jpg";
        img.style.width = "100%";
        div.appendChild(img);
        Container.insertBefore(div, FirstArrow);
        
        let Dot = document.createElement("span");
        Dot.classList.add("dot");
        Dot.Onclick = function(){currentSlide(i);};
        DotContainer.appendChild(Dot);
    }
}

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}