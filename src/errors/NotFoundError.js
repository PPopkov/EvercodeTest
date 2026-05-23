class NotFoundError extends Error {
    constructor(message){
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
        this.timestamp = new Date();
    }
}

module.exports = { NotFoundError };