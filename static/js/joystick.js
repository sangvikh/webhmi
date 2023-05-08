class Joystick {
    constructor(joystickId, joystickAreaId, joystickValueId, identifier) {
        this.joystick = document.getElementById(joystickId);
        this.joystickArea = document.getElementById(joystickAreaId);
        this.joystickValue = document.getElementById(joystickValueId);

        this.initEventListeners();
        this.startSendingJoystickData();

        this.isMouseDown = false;
        this.isInsideJoystickArea = false;

        this.joystickXNormalized = 0.0;
        this.joystickYNormalized = 0.0;

        this.identifier = identifier;
    }

    initEventListeners() {
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), false);

        document.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        document.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
        document.addEventListener('mouseleave', this.handleMouseUp.bind(this), false);
    }

    startSendingJoystickData() {
        setInterval(() => {
            this.sendJoystickData(this.joystickXNormalized, this.joystickYNormalized);
        }, 100);
    }

    handleTouchStart(e) {
        if (e.target === this.joystick || e.target === this.joystickArea) {
            e.preventDefault();
            this.isInsideJoystickArea = true;
            this.moveJoystick(e.targetTouches[0]);
        }
    }
    
    handleTouchMove(e) {
        if (this.isInsideJoystickArea) {
            e.preventDefault();
            this.moveJoystick(e.targetTouches[0]);
        }
    }
    
    handleTouchEnd(e) {
        if (this.isInsideJoystickArea) {
            e.preventDefault();
            // Move the joystick to the center (zero position)
            this.joystick.style.transform = `translate(0%, 0%)`;
            this.isInsideJoystickArea = false;
    
            // Reset joystick values
            this.joystickXNormalized = 0;
            this.joystickYNormalized = 0;
            this.updateJoystickValue(0, 0);
        }
    }
    
    handleMouseDown(e) {
        if (e.target === this.joystick || e.target === this.joystickArea) {
            e.preventDefault();
            this.isMouseDown = true;
            this.moveJoystick(e);
        }
    }
    
    handleMouseMove(e) {
        if (this.isMouseDown) {
            e.preventDefault();
            this.moveJoystick(e);
        }
    }
    
    handleMouseUp(e) {
        if (this.isMouseDown) {
            e.preventDefault();
            // Move the joystick to the center (zero position)
            this.joystick.style.transform = `translate(0%, 0%)`;
            this.isMouseDown = false;
    
            // Reset joystick values
            this.joystickXNormalized = 0;
            this.joystickYNormalized = 0;
            this.updateJoystickValue(0, 0);
        }
    }
    
    
    moveJoystick(input) {
        const rect = this.joystickArea.getBoundingClientRect();
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
    
        this.joystick.style.transform = `translate(${joystickX}px, ${joystickY}px)`;
    
        // Update the displayed joystick values
        this.joystickXNormalized = joystickX / maxDistance;
        this.joystickYNormalized = joystickY / maxDistance;
        this.updateJoystickValue(this.joystickXNormalized, this.joystickYNormalized);
    }
    
    updateJoystickValue(x, y) {
        this.joystickValue.textContent = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
    }
    
    sendJoystickData(x, y) {
        fetch('/joystick-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: this.identifier, x: x, y: y})
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
}

const rightJoystick = new Joystick('joystick', 'joystickArea', 'joystickValue', 'right');