import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import {
    oracleErrorResponse,
    badRequestErrorResponse,
    internalServerErrorResponse
} from '@utils/errorUtils';
import type { User } from '@models/user/user';
import type { UserReport } from '@models/user/userReport';
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

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const tester = req.claims?.tester ?? false;

    try {
        const user = await userRepository.getUsers(tester);
        res.status(200).json(user);
    } catch (error: any) {
        e(new Error(`Error getting users: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const tester = req.claims?.tester ?? false;

    try {
        const user = await userRepository.getUser(userId, tester);
        res.status(200).json(user);
    } catch (error: any) {
        e(new Error(`Error getting user: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const {
        USER_ID: id,
        USER_FIRST_NAME: firstName,
        USER_LAST_NAME: lastName,
        USER_EMAIL: email,
        USER_SCHOOL_LEVEL: schoolLevel,
        USER_STATE: state
    } = req.body;

    if (!id || !firstName || !lastName || !email || !schoolLevel || !state) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

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

    try {
        await userRepository.createUser(user);
        const serverResponse: ServerResponse = { message: 'User has been created successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error creating user: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
    const {
        USER_ID: userId,
        USER_PROFILE_PICTURE_FILE_NAME: previousProfilePictureFileName
    } = req.body;
    const imageFile = req.file;

    if(!imageFile || !userId) {
        res.status(400).json(badRequestErrorResponse);
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
        e(new Error(`Error updating profile picture of user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
        return;
    }

    if (previousProfilePictureFileName) {
        try {
            await imageRepository.deleteImage(getProfilePicturePath(previousProfilePictureFileName))
        } catch (error: any) {
            e(new Error(`Error deleting previous profile picture of user ${userId}: ${error.message}`));
        }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
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
        res.status(400).json(badRequestErrorResponse);
        return;
    }

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

    try {
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
        e(new Error(`Error deleting user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
        return;
    }

    if (profilePictureFileName) {
        try {
            await imageRepository.deleteImage(getProfilePicturePath(profilePictureFileName))
        } catch (error: any) {
            e(new Error(`Error deleting previous profile picture of user ${userId}: ${error.message}`));
        }
    }
}

export const deleteProfilePicture = async (req: Request, res: Response): Promise<void> => {
    const {
        USER_ID: userId,
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName
    } = req.body;

    if(!userId || !profilePictureFileName) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        await userRepository.deleteProfilePictureFileName(userId);
        await imageRepository.deleteImage(getProfilePicturePath(profilePictureFileName))

        const serverResponse: ServerResponse = { message: 'Profile picture has been deleted successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error deleting profile picture of user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const reportUser = async (req: Request, res: Response): Promise<void> => {
    const {
        reportedUser: reportedUser,
        reporter: reporter,
        reason: reason
    } = req.body;

    if (!reportedUser || !reporter || !reason) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    const report: UserReport = {
        reportedUser: reportedUser,
        reporter: reporter,
        reason: reason
    };

    try {
        await userRepository.reportUser(report);
        const serverResponse: ServerResponse = { message: 'User has been reported successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error reporting user ${reportedUser}: ${error.message}`));
        res.status(500).json(internalServerErrorResponse);
    }
}

function getProfilePicturePath(fileName: string): string {
    return `UserProfilePictures/${fileName}`;
}