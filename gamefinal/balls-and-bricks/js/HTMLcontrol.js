function showDiv(div, always) {
  if (always == null) {
    always = false;
  }
  if (!game.device.desktop || always) {
    document.getElementById(div).style.display = "block";
  }
}
function hideDiv(div, always) {
  if (always == null) {
    always = false;
  }
  if (!game.device.desktop || always) {
    document.getElementById(div).style.display = "none";
  }
}
function reloadPage() {
  window.location.reload(true);
}
;
