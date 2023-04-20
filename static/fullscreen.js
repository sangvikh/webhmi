document.addEventListener("DOMContentLoaded", function () {
    const fullscreenButton = document.getElementById("fullscreenButton");

    fullscreenButton.addEventListener("click", function () {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    });

    function onFullScreenChange() {
        if (document.fullscreenElement) {
            fullscreenButton.style.display = "none";
        } else {
            fullscreenButton.style.display = "block";
        }
    }

    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("mozfullscreenchange", onFullScreenChange); // Firefox
    document.addEventListener("webkitfullscreenchange", onFullScreenChange); // Chrome, Safari and Opera
    document.addEventListener("MSFullscreenChange", onFullScreenChange); // IE/Edge
});
