class Mission {
    #id
    #title
    #description
    #schoolLevelNumbers
    #date
    #startDate
    #endDate
    #frequency
    #participantMax
    #tasks
    #imageFileName

    constructor(
        id,
        title,
        description,
        schoolLevelNumbers,
        date,
        startDate,
        endDate,
        frequency,
        participantMax,
        tasks,
        imageFileName
    ) {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#schoolLevelNumbers = schoolLevelNumbers;
        this.#date = date;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#frequency = frequency;
        this.#participantMax = participantMax;
        this.#tasks = tasks;
        this.#imageFileName = imageFileName;
    }

    get id() { return this.#id; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get schoolLevelNumbers() { return this.#schoolLevelNumbers; }
    get date() { return this.#date; }
    get startDate() { return this.#startDate; }
    get endDate() { return this.#endDate; }
    get frequency() { return this.#frequency; }
    get participantMax() { return this.#participantMax; }
    get tasks() { return this.#tasks; }
    get imageFileName() { return this.#imageFileName; }
}

class MissionManager {
    #missionId
    #userId

    constructor(missionId, userId) {
        this.#missionId = missionId;
        this.#userId = userId;
    }

    get missionId() { return this.#missionId; }
    get userId() { return this.#userId; }
}

class MissionParticipant {
    #missionId
    #userId

    constructor(missionId, userId) {
        this.#missionId = missionId;
        this.#userId = userId;
    }

    get missionId() { return this.#missionId; }
    get userId() { return this.#userId; }
}

class MissionTask {
    #id
    #value
    #missionId

    constructor(id, value, missionId) {
        this.#id = id;
        this.#value = value;
        this.#missionId = missionId;
    }

    get id() { return this.#id; }
    get value() { return this.#value; }
    get missionId() { return this.#missionId; }
}

module.exports = Mission