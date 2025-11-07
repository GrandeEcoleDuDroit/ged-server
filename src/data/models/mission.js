class Mission {
    #id;
    #title;
    #description;
    #schoolLevels;
    #date;
    #startDate;
    #endDate;
    #duration;
    #managerIds
    #participantIds;
    #maxParticipants;
    #tasks;
    #imageFileName;

    constructor(
        id,
        title,
        description,
        schoolLevels,
        date,
        startDate,
        endDate,
        duration,
        managerIds,
        participantIds,
        maxParticipants,
        tasks,
        imageFileName
    ) {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#schoolLevels = schoolLevels;
        this.#date = date;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#duration = duration;
        this.#managerIds = managerIds;
        this.#participantIds = participantIds;
        this.#maxParticipants = maxParticipants;
        this.#tasks = tasks;
        this.#imageFileName = imageFileName;
    }

    get id() { return this.#id; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get schoolLevels() { return this.#schoolLevels; }
    get date() { return this.#date; }
    get startDate() { return this.#startDate; }
    get endDate() { return this.#endDate; }
    get duration() { return this.#duration; }
    get managerIds() { return this.#managerIds; }
    get participantIds() { return this.#participantIds; }
    get maxParticipants() { return this.#maxParticipants; }
    get tasks() { return this.#tasks; }
    get imageFileName() { return this.#imageFileName; }
}

module.exports = Mission;