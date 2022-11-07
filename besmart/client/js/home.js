// 1. creez element nou (nod)
const paragraf = document.createElement("p");

// 2. customizez / modific elementul nou creat 
paragraf.innerText = "Acesta este un paragraf creat folosind JavaScript.";
paragraf.style.fontFamily = "Courier";
paragraf.style.color = "red";
paragraf.name = "primul-paragraf";
paragraf.id = "pp1";
console.log(paragraf);

// 3. inserez elementul in pagina (DOM). 
// 3.1 identific si extrag parintele din DOM 
// 3.1.1 extrag dupa id 
const body = document.getElementById("home-page");
console.log(body);

// 3.1.2 extrag dupa tag 
const bodyTag = document.getElementsByTagName("body");
console.log(bodyTag);

// 3.1.3 extrag dupa nume
const bodyName = document.getElementsByName("body");
console.log(bodyName);

// 3.1.4 extrag dupa o proprietate css 
const bodyCSS = document.getElementsByClassName("body-sample");
console.log(bodyCSS);

// 3.2 inserez elementul nou in lista copiilor 
body.appendChild(paragraf);

let element;
for (const child of body.children) {
    if (child.tagName === "MAIN") {
        element = child;
        break;
    }
}
if (element !== undefined) {
    body.insertBefore(paragraf, element);
}

// modificare
// 1. identific si extrag elementul 
const p = document.getElementById("pp1");

// 2. modific 
p.style.color = 'blue';
p.innerText = "Acest paragraf a fost modificat.";

// stergere v1
// 1. identific si extrag elementul
// const body = document.getElementById("home-page");
// 2. sterg
// p.remove();

// stergere v2
// 1. identific si extrag parintele (body)
// const body = document.getElementById("home-page");
// 2. sterg copilul din parinte 
// 2.1. identific si extrag copilul
// const p = document.getElementById("pp1");
// 2.2. sterg 
body.removeChild(p);
