export const getHoursFromTwoDates = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const milliseconds = Math.abs(fromDate - toDate);
    return Math.floor(milliseconds / 36e5);
}
