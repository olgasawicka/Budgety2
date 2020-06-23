export const displayDate = () => {

    let now, month, months, year;

    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    now = new Date();
    year = now.getFullYear();
    month = now.getMonth();
    return { year, month:months[month]};
};