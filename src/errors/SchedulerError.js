class SchedulerError extends Error {
    constructor(message){
        super(message);
        this.name = "SchedulerError";
        this.statusCode = 500;
        this.timestamp = new Date();
    }
}

module.exports = { SchedulerError };