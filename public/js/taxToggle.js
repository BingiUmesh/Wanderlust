let taxSwitch = document.getElementById("switchCheckDefault");
let listenerActive = true;
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  if (listenerActive) {
    for (info of taxInfo) {
      info.style.display = "inline";
    }
  } else {
    for (info of taxInfo) {
      info.style.display = "none";
    }
  }
  listenerActive = !listenerActive;
});
