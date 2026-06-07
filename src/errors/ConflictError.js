class ConflictError extends Error {
    constructor(message){
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409;
        this.timestamp = new Date();
    }
}

module.exports = { ConflictError };