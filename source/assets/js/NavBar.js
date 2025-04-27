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
        if (lang.length === 2) {
            path = "../" + lang + "/components/Navbar/NavBar.html";
            console.log(path);
        } else {
            path = '../../components/Navbar/NavBar.html';
        }

        // Fetch the navbar HTML asynchronously
        fetch(path)
            .then(res => res.text())  // Get the HTML as text
            .then(html => {
                this.innerHTML = html;
            })
            .then(() => {
                // After loading the content, run SetupLanguage and OnResize
                SetupLanguage();
                OnScroll();
            });
    }
}
customElements.define('nav-bar', NavBar);

// Initial call to set the padding
requestAnimationFrame(OnResize); // Use requestAnimationFrame to trigger OnResize after initial rendering


function OnScroll() {
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
}

window.addEventListener('scroll', function () {
    OnScroll();
});

OnScroll();

function SetLanguage(lang) {
    current_link = document.URL;
    console.log(current_link);
    let current_language = document.querySelector("html").lang;
    let new_link = current_link.replace("/" + current_language + "/", "/" + lang + "/");
    window.location.href = new_link;
}

function SetupLanguage() {
    let Language = document.querySelector("html").lang;
    if (Language.length !== 2)
        Language = "en"
    let LanguageSelector = document.getElementById('LanguageSelector');
    LanguageSelector.value = Language;
    LanguageSelector.addEventListener("change", (e) => {SetLanguage(e.target.value);});
}
