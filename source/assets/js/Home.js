const SlideCount = 6;
let CurrentSlideIndex = -1;

let SlideTimer = null;
const SLIDE_INTERVAL = 12; // In seconds

SetupSlides();
StartSlideshowTimer();

function SetupSlides() {
    const ImageContainer = document.getElementById('HomePageSlideshowContainer');
    const DotContainer = document.getElementById('HomePageSlideshowDotContainer');
    
    for(let i = 1; i <= SlideCount; i++) {
        let Image = document.createElement("img");
        Image.src = "/Sito-Melona/source/assets/images/Showcase" + i.toString() + ".png";
        Image.classList.add("SlideshowImage");
        Image.alt = "Showcase " + i.toString();
        ImageContainer.appendChild(Image);
        Image.classList.add("InactiveSlide");


        const Dot = document.createElement("span");
        Dot.classList.add("dot");
        Dot.onclick = function(){ SetSlide(i - 1); };
        DotContainer.appendChild(Dot);
    }
    SetSlide(0);
}

function ChangeSlide(Amount) {
    SetSlide((CurrentSlideIndex + SlideCount + Amount) % SlideCount);
}

function SetSlide(NewIndex) {
    const Images = document.getElementById("HomePageSlideshowContainer").children;
    const Dots = document.getElementById("HomePageSlideshowDotContainer").children;

    // Remove current slide
    if (CurrentSlideIndex >= 0) {
        const PrevSlide = Images[CurrentSlideIndex];

        // Freeze the current object-position based on animation progress
        const computedStyle = getComputedStyle(PrevSlide);
        const currentPosition = computedStyle.objectPosition;
        PrevSlide.style.animation = "none"; // Stop animation
        PrevSlide.style.objectPosition = currentPosition; // Lock in current position

        PrevSlide.classList.remove('ActiveSlide');
        PrevSlide.classList.add("InactiveSlide");
        Dots[CurrentSlideIndex].classList.remove("ActiveDot");
    }

    // Set new slide
    CurrentSlideIndex = NewIndex;
    const NewSlide = Images[CurrentSlideIndex];

    NewSlide.classList.add('ActiveSlide');
    NewSlide.classList.remove('InactiveSlide');
    Dots[CurrentSlideIndex].classList.add('ActiveDot');

    // Restart animation by forcing reflow
    NewSlide.style.animation = "none";
    void NewSlide.offsetWidth; // trigger reflow
    NewSlide.style.animation = "verticalPan 10s ease-in-out forwards";
    NewSlide.style.objectPosition = "center top"; // reset position at start
}

function StartSlideshowTimer() {
    if (SlideTimer) {
        clearTimeout(SlideTimer); // clear existing timer
    }
    SlideTimer = setTimeout(() => {
        ChangeSlide(1);
        StartSlideshowTimer(); // schedule next cycle
    }, SLIDE_INTERVAL * 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    const scrollFadeElements = document.querySelectorAll(".scroll-fade");

    function handleScrollFade() {
        scrollFadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) { // 100px before it fully enters
                element.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", handleScrollFade);
    window.addEventListener("resize", handleScrollFade);
    handleScrollFade(); // Call once to handle elements already in view
});