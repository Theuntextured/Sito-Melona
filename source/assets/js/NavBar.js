const navbar = document.querySelector('nav-bar');
const scrollThreshold = 100;
const content = document.getElementById("Content");

String.prototype.rsplit = function(sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
}

class NavBar extends HTMLElement {


    connectedCallback() {
        let lang = document.querySelector("html").lang;
        let path;
        if(lang.length === 2){
            path = "../" + lang + "/components/Navbar/NavBar.html"
            console.log(path);
        }
        else {
            path = '../../components/Navbar/NavBar.html';
        }
        fetch(path)
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
