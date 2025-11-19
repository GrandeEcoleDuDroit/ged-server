const { e } = require('@utils/logs')

const verifyAddParticipantValidity = (req, res, next) => {
    const {
        MISSION_ID: missionId,
        MISSION_PARTICIPANTS_NUMBER: participantsNumber,
        MISSION_MAX_PARTICIPANTS: maxParticipants,
        USER_ID: userId,
        USER_SCHOOL_LEVEL: userSchoolLevel
    } = req.body;

    let {
        MISSION_SCHOOL_LEVELS: schoolLevels
    } = req.body;

    schoolLevels = schoolLevels || [];

    if (
        !missionId ||
        maxParticipants === null ||
        participantsNumber === null ||
        !userId ||
        !userSchoolLevel
    ) {
        const serverResponse = {
            message: "Error adding participant to mission",
            error: `
            Some missing register fields :
            {
                missionId: ${missionId},
                maxParticipants: ${maxParticipants},
                participantsNumber: ${participantsNumber},
                userId: ${userId},
                userSchoolLevel: ${userSchoolLevel}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    if (schoolLevels.length > 0 && !schoolLevels.includes(userSchoolLevel))  {
        const serverResponse = {
            message: 'Error adding participant to mission',
            error : "User school level not allowed for this mission"
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    if (participantsNumber >= maxParticipants) {
        const serverResponse = {
            message: 'Error adding participant to mission',
            error : "Mission is full"
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    next();
}

module.exports = {
    verifyAddParticipantValidity
}