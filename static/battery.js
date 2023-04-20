function updateBatteryStatus(battery) {
    const batteryLevel = document.getElementById('battery-level');
    const batteryText = document.getElementById('battery-text');

    const level = battery.level * 100;
    batteryLevel.style.width = `${level}%`;
    batteryText.innerText = `${level.toFixed(0)}%`;

    if (level > 70) {
        batteryLevel.style.backgroundColor = 'lime';
    } else if (level > 30) {
        batteryLevel.style.backgroundColor = 'yellow';
    } else {
        batteryLevel.style.backgroundColor = 'red';
    }
}

navigator.getBattery().then(battery => {
    updateBatteryStatus(battery);

    battery.addEventListener('levelchange', () => {
        updateBatteryStatus(battery);
    });
});