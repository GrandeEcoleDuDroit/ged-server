class MissionReport {
    #missionId;
    #userInfo;
    #reason;

    constructor(missionId, userInfo, reason) {
        this.#missionId = missionId;
        this.#userInfo = userInfo;
        this.#reason = reason;
    }

    get missionId() { return this.#missionId; }
    get userInfo() { return this.#userInfo; }
    get reason() { return this.#reason; }
}

module.exports = MissionReport;