class AnnouncementReport {
    #announcementId;
    #authorInfo;
    #userInfo;
    #reason;

    constructor(announcementId, authorInfo, userInfo, reason) {
        this.#announcementId = announcementId;
        this.#authorInfo = authorInfo;
        this.#userInfo = userInfo;
        this.#reason = reason;
    }

    get announcementId() { return this.#announcementId; }
    get authorInfo() { return this.#authorInfo; }
    get userInfo() { return this.#userInfo; }
    get reason() { return this.#reason; }
}

module.exports = AnnouncementReport;