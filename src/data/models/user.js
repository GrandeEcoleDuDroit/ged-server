class User {
    #id;
    #firstName;
    #lastName;
    #email;
    #schoolLevel;
    #isAdmin;
    #profilePictureFileName;
    #isDeleted;

    constructor(
        id,
        firstName,
        lastName,
        email,
        schoolLevel,
        isAdmin = 0,
        profilePictureFileName = null,
        isDeleted = 0
    ) {
        this.#id = id;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#email = email;
        this.#schoolLevel = schoolLevel;
        this.#isAdmin = isAdmin;
        this.#profilePictureFileName = profilePictureFileName;
        this.#isDeleted = isDeleted;
    }

    get id() { return this.#id; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get email() { return this.#email; }
    get schoolLevel() { return this.#schoolLevel; }
    get isAdmin() { return this.#isAdmin; }
    get profilePictureFileName() { return this.#profilePictureFileName; }
    get isDeleted() { return this.#isDeleted; }
}

module.exports = User;