class ExternalServiceError extends Error {
    constructor(message){
        super(message);
        this.name = "ExternalServiceError";
        this.statusCode = 502;
        this.timestamp = new Date();
    }
}

module.exports = { ExternalServiceError };