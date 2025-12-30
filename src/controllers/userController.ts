import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import {formatOracleError, invalidFieldsErrorMessage} from '@utils/exceptionUtils';
import type { User, UserReport } from '@models/user';
import UserRepository from '@repositories/userRepository';
import {Readable} from 'stream';
import ImageRepository from '@repositories/imageRepository';
import AnnouncementRepository from '@repositories/announcementRepository';
import FirebaseApi from '@api/firebaseApi';
import type {ServerResponse} from '@models/serverResponse';

const userRepository = new UserRepository();
const imageRepository = new ImageRepository();
const announcementRepository = new AnnouncementRepository();
const firebaseApi = new FirebaseApi();

export const getUsers = async (req: Request, res: Response) => {
    const tester = req.claims?.tester ?? false;

    try {
        const user = await userRepository.getUsers(tester);
        res.status(200).json(user);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error getting users', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const getUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const tester = req.claims?.tester ?? false;

    try {
        const user = await userRepository.getUser(userId, tester);
        res.status(200).json(user);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error getting user', error);
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
        const serverResponse: ServerResponse = {
            message: 'Error creating user',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const user: User = {
            userId: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            schoolLevel: schoolLevel,
            admin: 0,
            profilePictureFileName: null,
            state: 1,
            tester: 0
        };

        await userRepository.createUser(user);
        const serverResponse: ServerResponse = { message: 'User has been created successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error creating user', error);
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
        USER_TESTER: tester
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
        const serverResponse: ServerResponse = {
            message: 'Error updating user',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const user: User = {
            userId: id,
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
        const serverResponse: ServerResponse = { message: 'User has been updated successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error updating user', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const updateProfilePicture = async (req: Request, res: Response) => {
    const {
        USER_ID: userId,
        USER_PROFILE_PICTURE_FILE_NAME: previousProfilePictureFileName
    } = req.body;
    const imageFile = req.file;

    if(!imageFile || !userId) {
        const serverResponse: ServerResponse = {
            message: 'Error updating profile picture',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await imageRepository.uploadImage(
            Readable.from(imageFile.buffer),
            getProfilePicturePath(imageFile.originalname),
            imageFile.size
        )
        await userRepository.updateProfilePictureFileName(imageFile.originalname, userId);
        const serverResponse: ServerResponse = { message: `Profile picture file has been updated successfully` };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error updating profile picture', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
        return;
    }

    if (previousProfilePictureFileName) {
        try {
            await imageRepository.deleteImage(getProfilePicturePath(previousProfilePictureFileName))
        } catch (error) {
            e(`Error deleting previous profile picture of ${userId}`, error);
        }
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const {
        USER_ID: userId,
        USER_FIRST_NAME: firstName,
        USER_LAST_NAME: lastName,
        USER_EMAIL: email,
        USER_SCHOOL_LEVEL: schoolLevel,
        USER_ADMIN: admin,
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName,
        USER_STATE: state,
        USER_TESTER: tester
    } = req.body;

    if (
        userId == null ||
        firstName == null ||
        lastName == null ||
        email == null ||
        schoolLevel == null ||
        admin == null ||
        state == null ||
        tester == null
    ) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting user',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        let deletedUser: User = {
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            email: `${userId}@deleted.com`,
            schoolLevel: schoolLevel,
            admin: admin,
            profilePictureFileName: null,
            state: 2,
            tester: tester
        }

        await userRepository.updateUser(deletedUser);
        await announcementRepository.deleteUserAnnouncements(userId, tester)
        if (req.uid) {
            await firebaseApi
                .getAuth()
                .deleteUser(req.uid);
        }

        const serverResponse: ServerResponse = { message: 'User has been deleted successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error deleting user', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
        return;
    }

    if (profilePictureFileName) {
        try {
            await imageRepository.deleteImage(getProfilePicturePath(profilePictureFileName))
        } catch (error) {
            e(`Error deleting profile picture of ${userId}`, error);
        }
    }
}

export const deleteProfilePicture = async (req: Request, res: Response) => {
    const {
        USER_ID: userId,
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName
    } = req.body;

    if(!userId || !profilePictureFileName) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting profile picture',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await userRepository.deleteProfilePictureFileName(userId);
        await imageRepository.deleteImage(getProfilePicturePath(profilePictureFileName))

        const serverResponse: ServerResponse = { message: 'Profile picture has been deleted successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error deleting profile picture', error);
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
        const serverResponse: ServerResponse = {
            message: 'Error reporting user',
            error: `Missing fields`
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const report: UserReport = {
            reportedUser: reportedUser,
            reporter: reporter,
            reason: reason
        };

        await userRepository.reportUser(report);
        const serverResponse: ServerResponse = { message: 'User has been reported successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error reporting user',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

function getProfilePicturePath(fileName: string) {
    const profilePictureFolder = 'UserProfilePictures';
    return `${profilePictureFolder}/${fileName}`;
}