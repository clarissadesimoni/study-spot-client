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

export { getStartOfWeek, getEndOfWeek }