function calculateAvailableAppointmentTimes(doctor) {
    const appointmentInterval = doctor.appointmentInterval;
    const availableTimes = [];
    const workingHoursStart = 9; 
    const workingHoursEnd = 17; 

    let currentTime = new Date();
    currentTime.setHours(workingHoursStart, 0, 0, 0); // Saat 9 olarak ayarlandı. 

    while (currentTime.getHours() < workingHoursEnd) {
        if (currentTime.getHours() >= 12 && currentTime.getHours() < 13) {
            currentTime.setHours(13, 0, 0, 0);
            continue;
        };

        availableTimes.push(new Date(currentTime));
        currentTime.setMinutes(currentTime.getMinutes() + appointmentInterval);
    };

    return availableTimes;
}

// [
//     2023-10-22T09:00:00.000Z, 2023-10-22T09:20:00.000Z,
//     2023-10-22T09:40:00.000Z, 2023-10-22T10:00:00.000Z,
//     2023-10-22T10:20:00.000Z, 2023-10-22T10:40:00.000Z,
//     2023-10-22T11:00:00.000Z, 2023-10-22T11:20:00.000Z,
//     2023-10-22T11:40:00.000Z, 2023-10-22T13:00:00.000Z,
//     2023-10-22T13:20:00.000Z, 2023-10-22T13:40:00.000Z,
//     2023-10-22T14:00:00.000Z, 2023-10-22T14:20:00.000Z,
//     2023-10-22T14:40:00.000Z, 2023-10-22T15:00:00.000Z,
//     2023-10-22T15:20:00.000Z, 2023-10-22T15:40:00.000Z,
//     2023-10-22T16:00:00.000Z, 2023-10-22T16:20:00.000Z,
//     2023-10-22T16:40:00.000Z
//   ]
  