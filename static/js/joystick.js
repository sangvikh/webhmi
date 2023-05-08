const joystick = document.getElementById('joystick');
const joystickArea = document.getElementById('joystickArea');
const joystickValue = document.getElementById('joystickValue');

// Touch events
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

// Mouse events
document.addEventListener('mousedown', handleMouseDown, false);
document.addEventListener('mousemove', handleMouseMove, false);
document.addEventListener('mouseup', handleMouseUp, false);
document.addEventListener('mouseleave', handleMouseUp, false);

let isMouseDown = false;
let isInsideJoystickArea = false;

function handleTouchStart(e) {
    if (e.target === joystick || e.target === joystickArea) {
        e.preventDefault();
        isInsideJoystickArea = true;
        moveJoystick(e.targetTouches[0]);
    }
}

function handleTouchMove(e) {
    if (isInsideJoystickArea) {
        e.preventDefault();
        moveJoystick(e.targetTouches[0]);
    }
}

function handleTouchEnd(e) {
    if (isInsideJoystickArea) {
        e.preventDefault();
        // Move the joystick to the center (zero position)
        joystick.style.transform = `translate(0%, 0%)`;
        isInsideJoystickArea = false;

        // Reset joystick values
        joystickXNormalized = 0;
        joystickYNormalized = 0;
        updateJoystickValue(joystickXNormalized, joystickYNormalized);
        sendJoystickData(joystickXNormalized, joystickYNormalized);
    }
}

function handleMouseDown(e) {
    if (e.target === joystick || e.target === joystickArea) {
        e.preventDefault();
        isMouseDown = true;
        moveJoystick(e);
    }
}

function handleMouseMove(e) {
    if (isMouseDown) {
        e.preventDefault();
        moveJoystick(e);
    }
}

function handleMouseUp(e) {
    if (isMouseDown) {
        e.preventDefault();
        // Move the joystick to the center (zero position)
        joystick.style.transform = `translate(0%, 0%)`;
        isMouseDown = false;

        // Reset joystick values
        joystickXNormalized = 0;
        joystickYNormalized = 0;
        updateJoystickValue(joystickXNormalized, joystickYNormalized);
        sendJoystickData(joystickXNormalized, joystickYNormalized);
    }
}

let joystickXNormalized = 0;
let joystickYNormalized = 0;

function moveJoystick(input) {
    const rect = joystickArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const inputX = input.clientX;
    const inputY = input.clientY;

    const deltaX = inputX - centerX;
    const deltaY = inputY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2 - joystick.clientWidth / 2;

    const ratio = Math.min(distance, maxDistance) / maxDistance;
    const angle = Math.atan2(deltaY, deltaX);

    const joystickX = ratio * maxDistance * Math.cos(angle);
    const joystickY = ratio * maxDistance * Math.sin(angle);

    joystick.style.transform = `translate(${joystickX}px, ${joystickY}px)`;

    // Update the displayed joystick values
    joystickXNormalized = joystickX / maxDistance;
    joystickYNormalized = joystickY / maxDistance;
    updateJoystickValue(joystickXNormalized, joystickYNormalized);
}

function updateJoystickValue(x, y) {
    joystickValue.textContent = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
}

function sendJoystickData(x, y) {
    fetch('/joystick-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({x: x, y: y})
    })
    .then(response => response.json())
    .then(data => {
        if (data.result !== 'success') {
            console.error('Error sending joystick data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Send joystick data every 100 ms
setInterval(() => {
    sendJoystickData(joystickXNormalized, joystickYNormalized);
}, 100);
