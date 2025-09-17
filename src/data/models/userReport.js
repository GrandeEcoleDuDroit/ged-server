class UserReport {
    #userId;
    #userInfo;
    #reporterInfo;
    #reason;

    constructor(userId, userInfo, reporterInfo, reason) {
        this.#userId = userId;
        this.#userInfo = userInfo;
        this.#reporterInfo = reporterInfo;
        this.#reason = reason;
    }

    get userId() { return this.#userId; }
    get userInfo() { return this.#userInfo; }
    get reporterInfo() { return this.#reporterInfo; }
    get reason() { return this.#reason; }
}

module.exports = UserReport;