class Announcement {
    #id;
    #title;
    #content;
    #date;
    #userId;

    constructor(id, title, content, date, userId) {
        this.#id = id;
        this.#title = title;
        this.#content = content;
        this.#date = date;
        this.#userId = userId;
    }

    get id() { return this.#id; }
    get title() { return this.#title; }
    get content() { return this.#content; }
    get date() { return this.#date; }
    get userId() { return this.#userId; }
}

module.exports = Announcement;