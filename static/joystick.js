const joystick = document.getElementById('joystick');
const joystickArea = document.getElementById('joystickArea');
const joystickValue = document.getElementById('joystickValue');

// Touch events
joystickArea.addEventListener('touchstart', handleTouchStart, false);
joystickArea.addEventListener('touchmove', handleTouchMove, false);
joystickArea.addEventListener('touchend', handleTouchEnd, false);

// Mouse events
joystickArea.addEventListener('mousedown', handleMouseDown, false);
joystickArea.addEventListener('mousemove', handleMouseMove, false);
joystickArea.addEventListener('mouseup', handleMouseUp, false);
joystickArea.addEventListener('mouseleave', handleMouseUp, false);

let isMouseDown = false;

function handleTouchStart(e) {
    e.preventDefault();
    moveJoystick(e.targetTouches[0]);
}

function handleTouchMove(e) {
    e.preventDefault();
    moveJoystick(e.targetTouches[0]);
}

function handleTouchEnd(e) {
    e.preventDefault();
    joystick.style.transform = `translate(0%, 0%)`;
    updateJoystickValue(0, 0);
    sendJoystickData(0,0);
}

function handleMouseDown(e) {
    e.preventDefault();
    isMouseDown = true;
    moveJoystick(e);
}

function handleMouseMove(e) {
    e.preventDefault();
    if (isMouseDown) {
        moveJoystick(e);
    }
}

function handleMouseUp(e) {
    e.preventDefault();
    isMouseDown = false;
    joystick.style.transform = `translate(0%, 0%)`;
    updateJoystickValue(0, 0);
    sendJoystickData(0,0);
}

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
    updateJoystickValue(joystickX / maxDistance, joystickY / maxDistance);

    // Send joystick data to the server
    sendJoystickData(joystickX / maxDistance, joystickY / maxDistance);
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