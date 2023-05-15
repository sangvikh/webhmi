// JavaScript queue object
let queue = {
    messages: [],
    enqueue: function (msg) {
        this.messages.push(msg);
        this.display();
    },
    dequeue: function () {
        return this.messages.shift();
    },
    display: function () {
        let msgBox = document.getElementById("messageBox");
        if (this.messages.length > 0) {
            let currentMsg = this.dequeue();
            msgBox.innerHTML = currentMsg;
            setTimeout(() => {
                this.display();
            }, 3000);  // Display each message for 3 seconds
        } else {
            msgBox.innerHTML = "";
        }
    }
};

async function getNextMessage() {
    const response = await fetch('/get_message');
    const data = await response.json();
    if (data.message !== null) {
        queue.enqueue(data.message);
    }
}

setInterval(getNextMessage, 1000);  // Check for a new message every second
