document.addEventListener("DOMContentLoaded", function () {
    function createButtonHandler(url, buttonId) {
        const button = document.getElementById(buttonId);
        let intervalId;

        function updateNumber() {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    document.getElementById("currentNumber").textContent = data.new_value;
                });
        }

        button.addEventListener("mousedown", function () {
            updateNumber();
            intervalId = setInterval(updateNumber, 100); // Adjust the interval as needed
        });

        button.addEventListener("mouseup", function () {
            clearInterval(intervalId);
        });

        // Handle the case when the mouse leaves the button while pressed
        button.addEventListener("mouseleave", function () {
            clearInterval(intervalId);
        });
    }

    createButtonHandler("/zoom_in", "zoomInButton");
    createButtonHandler("/zoom_out", "zoomOutButton");
});
