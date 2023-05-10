let timeout = 1000;

function checkConnection() {
    const startTime = new Date().getTime();
    const connectionStatusIcon = document.getElementById('connectionStatusIcon');

    fetch('/ping') 
        .then(response => {
            const latency = new Date().getTime() - startTime;
            isConnected = latency < timeout; 

            if (!isConnected) {
                // Show the 'connection lost' icon
                connectionStatusIcon.style.display = '';
            } else {
                // Hide the icon when connection is restored
                connectionStatusIcon.style.display = 'none';
            }
        })
        .catch(error => {
            isConnected = false;
            // Show the 'connection lost' icon
            connectionStatusIcon.className = 'fas fa-exclamation-circle';
            connectionStatusIcon.style.display = '';
        });
}

// Call checkConnection every second
setInterval(checkConnection, timeout/2);
