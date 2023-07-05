function getOffset(timeZone = 'UTC', date = new Date()) {
    const utcDate = new Date(date.toLocaleString('it-IT', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('it-IT', { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / 6e4;
}

function todoistFilterToString(date = new Date()) {
    return Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);
}

function getStartOfWeek(d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}
function getEndOfWeek(d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() + (day == 0 ? 0 : 7 - day)
    return new Date(d.setDate(diff));
}

export { getStartOfWeek, getEndOfWeek, todoistFilterToString }