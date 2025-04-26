class Footer extends HTMLElement {
    connectedCallback() {
        let lang = document.querySelector("html").lang;
        let path;
        if(lang.length === 2){
            path = "../" + lang + "/components/Footer/Footer.html"
            console.log(path);
        }
        else {
            path = '../../components/Footer/Footer.html';
        }
        fetch(path)
            .then(res => res.text())
            .then(html => this.innerHTML = html);
    }
}
customElements.define('footer-template', Footer);