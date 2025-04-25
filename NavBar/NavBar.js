const navbar = document.querySelector('nav');
const scrollThreshold = 100;
const content = document.getElementById("Content");

class NavBar extends HTMLElement {
    connectedCallback() {
        fetch('/Navbar/NavBar.html')
            .then(res => res.text())
            .then(html => this.innerHTML = html);
    }
}
customElements.define('nav-bar', NavBar);

function OnResize(){
    content.style.paddingTop = `${navbar.offsetHeight}px`;    
}

OnResize();

window.addEventListener('resize', OnResize);

window.addEventListener('scroll', function () {
    if (window.scrollY > scrollThreshold) {
        if (!navbar.classList.contains('fixed')) {
            navbar.classList.add('fixed');
            navbar.classList.remove('static');  // Remove static when fixed
        }
    } else {
        if (!navbar.classList.contains('static')) {
            navbar.classList.add('static');
            navbar.classList.remove('fixed');  // Remove fixed when static
        }
    }
});
