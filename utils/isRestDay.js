
function isRestDay(restDates, date) {


    let restTimes = restDates.map(date => {
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    });

    const parts = date.split('T')[0].split('-');

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    const formattedDate = `${year}-${month}-${day}`;
   

    let formattedrestDates = restTimes.map(time => {
        return `${time.year.toString()}-${time.month}-${time.day}`;
    });

    for (let i = 0; i < formattedrestDates.length; i++) {
        if (formattedrestDates.includes(formattedDate)) {
            return true; 
        }
    }
    return false;
}

module.exports = { isRestDay };
