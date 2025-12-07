import { Request, Response } from 'express';
import { e } from '@utils/logs';
import type { User, UserReport } from '@models/user';
import UserRepository from '@repositories/userRepository';
import WhiteListRepository from '@repositories/whiteListRepository';
import { formatOracleError } from '@utils/exceptionUtils';

const userRepository = new UserRepository();
const whiteListRepository = new WhiteListRepository();

export const getUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const user = await userRepository.getUser(userId);
        res.status(200).json(user);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error getting user');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const createUser = async (req: Request, res: Response) => {
    const {
        USER_ID: id,
        USER_FIRST_NAME: firstName,
        USER_LAST_NAME: lastName,
        USER_EMAIL: email,
        USER_SCHOOL_LEVEL: schoolLevel,
        USER_STATE: state
    } = req.body;

    if (!id || !firstName || !lastName || !email || !schoolLevel || !state) {
        const serverResponse = {
            message: 'Error creating user',
            error: `
              All user fields are required :
              {
                id: ${id},
                firstName: ${firstName},
                lastName: ${lastName},
                email: ${email},
                schoolLevel: ${schoolLevel},
                state: ${state}
              }`
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const user: User = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            schoolLevel: schoolLevel,
            admin: 0,
            profilePictureFileName: null,
            state: state,
            tester: 0
        };

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
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error inserting user');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const {
        USER_ID: id,
        USER_FIRST_NAME: firstName,
        USER_LAST_NAME: lastName,
        USER_EMAIL: email,
        USER_SCHOOL_LEVEL: schoolLevel,
        USER_ADMIN: admin,
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName,
        USER_STATE: state,
        USER_TESTER: tester,
    } = req.body;

    if (
        id == null ||
        firstName == null ||
        lastName == null ||
        email == null ||
        schoolLevel == null ||
        admin == null ||
        state == null ||
        tester == null
    ) {
        const serverResponse = {
            message: 'Error updating user',
            error: `
              All user fields are required :
              {
                id: ${id},
                firstName: ${firstName},
                lastName: ${lastName},
                email: ${email},
                schoolLevel: ${schoolLevel},
                admin: ${admin},
                state: ${state},
                tester: ${tester}
              }`
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const user: User = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            schoolLevel: schoolLevel,
            admin: admin,
            profilePictureFileName: profilePictureFileName,
            state: state,
            tester: tester
        };

        await userRepository.updateUser(user);
        const serverResponse = {
            message: `User updated successfully`
        };

        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error updating user');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const updateProfilePictureFileName = async (req: Request, res: Response) => {
    const {
        USER_ID: userId,
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName
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
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error updating profile picture file name');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        await userRepository.deleteUser(userId);
        const serverResponse = { message: `User deleted successfully` };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error deleting user');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const deleteProfilePicture = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        await userRepository.deleteProfilePictureFileName(userId);
        const serverResponse = { message: `Profile picture file name deleted successfully` };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error deleting profile picture file name');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const reportUser = async (req: Request, res: Response) => {
    const {
        reportedUser: reportedUser,
        reporter: reporter,
        reason: reason
    } = req.body;

    if (!reportedUser || !reporter || !reason) {
        const serverResponse = {
            message: "Error to report user",
            error: `
            Some missing report fields :
            {
                reportedUser: ${reportedUser},
                reporter: ${reporter},
                reason: ${reason},
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const report: UserReport = {
            reportedUser: reportedUser,
            reporter: reporter,
            reason: reason
        };
        await userRepository.reportUser(report);
        const serverResponse = {
            message: `User ${report.reportedUser.id} has been reported successfully`
        };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
            message: 'Error reporting user',
            error: error.message
        };
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}