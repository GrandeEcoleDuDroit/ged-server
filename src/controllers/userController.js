const { e } = require('@utils/logs');
const User = require('@models/user');
const UserRepository = require('@repositories/userRepository');
const WhiteListRepository = require('@repositories/whiteListRepository');
const formatOracleError = require('@utils/exceptionUtils')

const userRepository = new UserRepository();
const whiteListRepository = new WhiteListRepository();

const getUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userRepository.getUser(userId);
        res.status(200).json(user);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error getting user');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const createUser = async (req, res) => {
    const {
        USER_ID: id,
        USER_FIRST_NAME: firstName,
        USER_LAST_NAME: lastName,
        USER_EMAIL: email,
        USER_SCHOOL_LEVEL: schoolLevel,
        USER_IS_MEMBER: isMember,
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName
    } = req.body;

    if (!id || !firstName || !lastName || !email || !schoolLevel) {
        const serverResponse = {
            message: 'Error creating user',
            error: `
              All user fields are required :
              {
                id: ${id},
                firstName: ${firstName},
                lastName: ${lastName},
                email: ${email},
                schoolLevel: ${schoolLevel}
              }`
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const user = new User(
            id,
            firstName,
            lastName,
            email,
            schoolLevel,
            isMember,
            profilePictureFileName
        );

        const isWhiteListed = await whiteListRepository.checkUserWhiteList(email);
        if (!isWhiteListed) {
            const serverResponse = {
                message: 'Error creating user',
                error: `User ${email} is not whitelisted`
            };

            e(serverResponse.message, new Error(serverResponse.error));
            return res.status(403).json(serverResponse);
        }

        await userRepository.createUser(user);

        const serverResponse = {
            message: `User ${user.firstName} ${user.lastName} created successfully.`
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error inserting user');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const updateProfilePicture = async (req, res) => {
    const {
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName,
        USER_ID: userId
    } = req.body;

    if(!profilePictureFileName && !userId) {
        const serverResponse = {
            message: 'Error updating profile picture file name',
            error: `Missing fields : 
            { 
                profilePictureFileName: ${profilePictureFileName},
                userId: ${userId}
            }`
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await userRepository.updateProfilePictureFileName(profilePictureFileName, userId);
        const serverResponse = {
            message: `Profile picture file name updated successfully`
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error updating profile picture file name');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const deleteProfilePicture = async (req, res) => {
    const userId = req.params.userId;

    try {
        await userRepository.deleteProfilePictureFileName(userId);
        const serverResponse = { message: `Profile picture file name deleted successfully` };
        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error deleting profile picture file name');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

module.exports = {
    getUser,
    createUser,
    updateProfilePicture,
    deleteProfilePicture,
}