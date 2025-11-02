class User {
    #id;
    #firstName;
    #lastName;
    #email;
    #schoolLevel;
    #admin;
    #profilePictureFileName;
    #state;
    #tester;

    constructor(
        id,
        firstName,
        lastName,
        email,
        schoolLevel,
        admin = 0,
        profilePictureFileName = null,
        state,
        tester = 0
    ) {
        this.#id = id;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#email = email;
        this.#schoolLevel = schoolLevel;
        this.#admin = admin;
        this.#profilePictureFileName = profilePictureFileName;
        this.#state = state;
        this.#tester = tester;
    }

    get id() { return this.#id; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get email() { return this.#email; }
    get schoolLevel() { return this.#schoolLevel; }
    get admin() { return this.#admin; }
    get profilePictureFileName() { return this.#profilePictureFileName; }
    get state() { return this.#state; }
    get tester() { return this.#tester; }
}

module.exports = User;