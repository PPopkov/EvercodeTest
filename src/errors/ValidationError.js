class ValidationError extends Error {
    constructor(message){
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400;
        this.timestamp = new Date();
    }
}

module.exports = { ValidationError };
