function calculateAge(birthDate) {

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

function convertDate(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return null; // Geçersiz tarih formatı
}

module.exports = {calculateAge, convertDate};