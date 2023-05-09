document.addEventListener("DOMContentLoaded", function () {
    function createButtonHandler(direction, buttonId) {
        const button = document.getElementById(buttonId);
        let intervalId;

        function updateNumber() {
            fetch("/zoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ direction: direction })
            })
                .then((response) => response.json())
                .then((data) => {
                    document.getElementById("currentZoom").textContent = data.result.toFixed(2);
                });
        }

        function startUpdating() {
            updateNumber();
            intervalId = setInterval(updateNumber, 100); // Adjust the interval as needed
        }

        function stopUpdating() {
            clearInterval(intervalId);
        }

        button.addEventListener("mousedown", startUpdating);
        button.addEventListener("mouseup", stopUpdating);
        button.addEventListener("mouseleave", stopUpdating);

        // Touch events for mobile devices
        button.addEventListener("touchstart", (event) => {
            event.preventDefault(); // Prevents mouse events from being triggered
            startUpdating();
        });
        button.addEventListener("touchend", stopUpdating);
    }

    createButtonHandler("in", "zoomInButton");
    createButtonHandler("out", "zoomOutButton");
});