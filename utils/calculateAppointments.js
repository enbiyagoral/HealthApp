function calculateAvailableTimes(doctor, days = 5) {
    const appointmentInterval = doctor.appointmentInterval;
    const availableTimes = [];
    const workingHoursStart = doctor.workingHours.start;
    const workingHoursEnd = doctor.workingHours.end;

    let currentDate = new Date();
    const trDateTimeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Istanbul' });
    trDateTimeFormatter.formatToParts(currentDate);

    currentDate.setUTCHours(workingHoursStart, 0, 0, 0);

    for (let i = 0; i < days; i++) {
        while (currentDate.getUTCDay() === 0 || currentDate.getUTCDay() === 6) {
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            currentDate.setUTCHours(workingHoursStart, 0, 0, 0);
        }

        while (currentDate.getUTCHours() < workingHoursEnd) {
            if (currentDate.getUTCHours() >= 12 && currentDate.getUTCHours() < 13) {
                currentDate.setUTCHours(13, 0, 0, 0);
                continue;
            }

            availableTimes.push(new Date(currentDate));
            currentDate.setUTCMinutes(currentDate.getUTCMinutes() + appointmentInterval);
        }

        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        currentDate.setUTCHours(workingHoursStart, 0, 0, 0);
    }
    return availableTimes;
}

module.exports = { calculateAvailableTimes };
