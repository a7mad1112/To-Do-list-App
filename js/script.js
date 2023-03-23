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
/* close aside button */
document.getElementById("close-btn").onclick = function () {
  document.querySelector("body > aside").classList.add("closed-bar");
};
/* open aside button */
document.getElementById("open-bar").onclick = function () {
  document.querySelector("body > aside").classList.remove("closed-bar");
};
window.addEventListener("load", function () {
  // Get the size of the screen
  let screenWidth = screen.width;
  if (screenWidth <= 576)
    document.querySelector("body > aside").classList.add("closed-bar");
});
