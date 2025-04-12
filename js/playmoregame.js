function open_fullscreen() {
	let game = document.getElementById("game-element");
	if (game.requestFullscreen) {
	  game.requestFullscreen();
	} else if (game.mozRequestFullScreen) { /* Firefox */
	  game.mozRequestFullScreen();
	} else if (game.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	  game.webkitRequestFullscreen();
	} else if (game.msRequestFullscreen) { /* IE/Edge */
	  game.msRequestFullscreen();
	}
};
function playGame(){
    var tmp = document.querySelector('#game-arena').dataset.url;
    document.querySelector('#game-arena').innerHTML = `<iframe id="game-element" allowfullscreen="" allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write" name="gameFrame" scrolling="no" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads" src="${tmp}"></iframe>`;
}
function loadGA(){
    if(window.location.host == 'leveldevil.net'){
        var  r = document.createElement("script");
    	r.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=GT-KD29WPM3"), r.setAttribute("type", "text/javascript"), r.setAttribute("crossOrigin", "anonymous"),  r.onload = function (){
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'GT-KD29WPM3', {
                'cookie_flags': 'SameSite=None;Secure'
              });
        },document.head.appendChild(r);
    }
}
window.addEventListener('load', function() {
    loadGA();
});