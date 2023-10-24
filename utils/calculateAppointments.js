function calculateAvailableTimes(doctor, days = 5) {
    const appointmentInterval = doctor.appointmentInterval;
    const availableTimes = [];
    const workingHoursStart = 9; 
    const workingHoursEnd = 17; 

    let currentDate = new Date();
    currentDate.setHours(workingHoursStart, 0, 0, 0); // Saat 9 olarak ayarlandı. 

    for (let i = 0; i < days; i++) {
        // Hafta sonu (Cumartesi veya Pazar) ise bir sonraki iş gününe atla
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(workingHoursStart, 0, 0, 0);
        }

        while (currentDate.getHours() < workingHoursEnd) {
            if (currentDate.getHours() >= 12 && currentDate.getHours() < 13) {
                currentDate.setHours(13, 0, 0, 0);
                continue;
            }

            availableTimes.push(new Date(currentDate));
            currentDate.setMinutes(currentDate.getMinutes() + appointmentInterval);
        }

        // Bir sonraki günü ayarla
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(workingHoursStart, 0, 0, 0);
    }

    return availableTimes;
}

module.exports = {calculateAvailableTimes}
