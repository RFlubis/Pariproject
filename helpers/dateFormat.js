function dateFormater(dateformat) {
    const options = { month: "long", weekday: "long", year: "numeric", day: "numeric" }
    return dateformat.toLocaleString("en-US", options)
}

module.exports = dateFormater