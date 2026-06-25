const { default: StatsObserver } = require("./StatsObserver")


class LoggingObserver {
    static update(review){
        console.log(
            `[${new Date().toISOString()}] ${review.title} was reviewed by ${review.userId}`
        )
    }
}

module.exports = StatsObserver;