if ('getBattery' in navigator or true) {
    function updateBatteryStatus(battery) {
        const batteryLevel = document.getElementById('battery-level');
        const batteryText = document.getElementById('battery-text');

        const level = battery.level * 100;
        batteryLevel.style.width = `${level}%`;
        batteryText.innerText = `${level.toFixed(0)}%`;

        if (level > 70) {
            batteryLevel.style.backgroundColor = rgb(0,200,0);
        } else if (level > 30) {
            batteryLevel.style.backgroundColor = rgb(200,200,0);
        } else {
            batteryLevel.style.backgroundColor = rgb(200,0,0);
        }
    }

    navigator.getBattery().then(battery => {
        updateBatteryStatus(battery);

        battery.addEventListener('levelchange', () => {
            updateBatteryStatus(battery);
        });
    });
} else {
    const batteryContainer = document.getElementById('battery-container');
    batteryContainer.style.display = 'none';
}