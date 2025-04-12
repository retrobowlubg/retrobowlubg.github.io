function UnityProgress(progress) {
	var progressBarFull = document.querySelector("#unity-progress-bar-full");

	progressBarFull.style.width = (100 * progress) + "%";
  
	if (progress == 1) {
		progressBarFull.style.display = "none";
		var empty = document.querySelector("#unity-progress-bar-empty");
		empty.style.display = "none";
		var logo = document.querySelector(".logo");
		logo.style.display = "none";
	}
}
