function calculateAvailableTimes(doctor, days = 5) {
    const workingInterval = doctor.workingHours.workingInterval;
    const workingDays = doctor.workingHours.days;
    const workingHoursStart = doctor.workingHours.start;
    const workingHoursEnd = doctor.workingHours.end;

    const lunchBreakStart = 12;
    const lunchBreakEnd = 13;

    const availableTimes = [];

    let currentDate = new Date();
    const trDateTimeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Istanbul' });
    trDateTimeFormatter.formatToParts(currentDate);

    currentDate.setUTCHours(workingHoursStart, 0, 0, 0);

    for (let i = 0; i < days; ) {
        while (!workingDays.includes(currentDate.getUTCDay())) {
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            currentDate.setUTCHours(workingHoursStart, 0, 0, 0);
        }

        while (currentDate.getUTCHours() < workingHoursEnd) {
            if (currentDate.getUTCHours() >= lunchBreakStart && currentDate.getUTCHours() < lunchBreakEnd) {
                currentDate.setUTCHours(lunchBreakEnd, 0, 0, 0);
                continue;
            }
            availableTimes.push(new Date(currentDate));
            currentDate.setUTCMinutes(currentDate.getUTCMinutes() + workingInterval);
        }

        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        currentDate.setUTCHours(workingHoursStart, 0, 0, 0);

        i++;
    }

    availableTimes
    return availableTimes;
}


module.exports = { calculateAvailableTimes };
