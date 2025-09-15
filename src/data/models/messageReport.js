class MessageReport {
    #conversationId;
    #messageId;
    #recipientInfo;
    #reason;

    constructor(conversationId, messageId, recipientInfo, reason) {
        this.#conversationId = conversationId;
        this.#messageId = messageId;
        this.#recipientInfo = recipientInfo;
        this.#reason = reason;
    }

    get conversationId() { return this.#conversationId; }
    get messageId() { return this.#messageId; }
    get recipientInfo() { return this.#recipientInfo; }
    get reason() { return this.#reason; }
}

module.exports = MessageReport;