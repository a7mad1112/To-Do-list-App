/* handle mode and mode toggler */
let displayMode = localStorage.getItem("mode") || "light";
displayMode === "dark" ?? document.body.classList.add("dark-display");
document.getElementById("display-mode").onclick = function () {
  displayMode = displayMode === "light" ? "dark" : "light";
  localStorage.setItem("mode", displayMode);
  displayMode === "dark"
    ? document.body.classList.add("display-dark")
    : document.body.classList.remove("display-dark");
};
/* toggle aside button */
document.getElementById("toggle-bar").onclick = function () {
  document.querySelector("body aside").classList.toggle("show-side");
};
/* accordion toggler */
const accordions = [...document.getElementsByClassName('content-box')];
// console.log(accordions)
accordions.forEach(element => {
  element.querySelector('.label').addEventListener('click', function(){
    element.classList.toggle('active');
  })
});