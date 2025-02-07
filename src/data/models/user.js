class User {
    #id;
    #firstName;
    #lastName;
    #email;
    #schoolLevel;
    #isMember;
    #profilePictureUrl;

    constructor(id, firstName, lastName, email, schoolLevel, isMember = 0, profilePictureUrl) {
        this.#id = id;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#email = email;
        this.#schoolLevel = schoolLevel;
        this.#isMember = isMember;
        this.#profilePictureUrl = profilePictureUrl;
    }

    get id() { return this.#id; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get email() { return this.#email; }
    get schoolLevel() { return this.#schoolLevel; }
    get isMember() { return this.#isMember; }
    get profilePictureUrl() { return this.#profilePictureUrl; }
}

module.exports = User;