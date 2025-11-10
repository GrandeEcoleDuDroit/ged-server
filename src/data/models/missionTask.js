class MissionTask {
    #id;
    #value;

    constructor(id, value) {
        this.#id = id;
        this.#value = value;
    }

    get id() { return this.#id; }
    get value() { return this.#value; }
}

module.exports = MissionTask;