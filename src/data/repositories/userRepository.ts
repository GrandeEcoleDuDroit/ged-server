import OracleApi from '@api/oracleApi';
import { sendMail } from '@api/googleApi';
import type { User, UserReport } from '@models/user';
import {Result} from "oracledb";
import FirebaseApi from "@api/firebaseApi";
import * as getUsersQuery from '@queries/user/getUsersQuery';
import * as getUserQuery from '@queries/user/getUserQuery';
import * as createUserQuery from '@queries/user/createUserQuery';
import * as updateUserQuery from '@queries/user/updateUserQuery';
import * as updateProfilePictureFileNameQuery from '@queries/user/updateProfilePictureFileNameQuery';
import * as deleteProfilePictureFileNameQuery from '@queries/user/deleteProfilePictureFileNameQuery';
import {FieldValue} from 'firebase-admin/firestore';
import {toFirestoreUser} from "@data/mappers/userMapper";

const oracleApi = OracleApi.instance;
const firebaseApi = new FirebaseApi();

const userCollection = 'users';

export default class UserRepository {
    async getUsers(tester: boolean): Promise<User[]> {
        const query = getUsersQuery.query;
        const binds = getUsersQuery.binds(tester ? 1 : 0)
        const result = await oracleApi.execute(query, binds);
        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as User
        ) ?? [];
    }

    async getUser(userId: string, tester: boolean): Promise<User | null> {
        const query = getUserQuery.query;
        const binds = getUserQuery.binds(userId, tester ? 1 : 0);
        const result = await oracleApi.execute(query, binds) as Result<string[]>;
        const userJson = result.rows?.[0]?.[0];
        return userJson ? JSON.parse(userJson) : null;
    }

    async createUser(user: User) {
        const query = createUserQuery.query;
        const binds = createUserQuery.binds(user);
        const firestoreUser = toFirestoreUser(user);

        await oracleApi.execute(query, binds, { autoCommit: true });
        await firebaseApi.getFirestore()
            .collection(userCollection)
            .doc(firestoreUser.userId)
            .set(firestoreUser);
    }

    async updateUser(user: User) {
        const query = updateUserQuery.query;
        const binds = updateUserQuery.binds(user);
        const firestoreUser = toFirestoreUser(user);

        await oracleApi.execute(query, binds, { autoCommit: true });
        await firebaseApi.getFirestore()
            .collection(userCollection)
            .doc(firestoreUser.userId)
            .set(firestoreUser, { merge: true });
    }

    async updateProfilePictureFileName(profilePictureFileName: string, userId: string) {
        const query = updateProfilePictureFileNameQuery.query;
        const binds = updateProfilePictureFileNameQuery.binds(profilePictureFileName, userId);

        await oracleApi.execute(query, binds, { autoCommit: true });
        await firebaseApi
            .getFirestore()
            .collection(userCollection)
            .doc(userId)
            .update({ profilePictureFileName: profilePictureFileName });
    }

    async deleteProfilePictureFileName(userId: string) {
        const query = deleteProfilePictureFileNameQuery.query;
        const binds = deleteProfilePictureFileNameQuery.binds(userId);

        await oracleApi.execute(query, binds, { autoCommit: true });
        await firebaseApi.getFirestore()
            .collection(userCollection)
            .doc(userId)
            .update({ profilePictureFileName: FieldValue.delete() });
    }

    async reportUser(report: UserReport) {
        const subject = `User report: ${report.reportedUser.id}`;
        const html = `
           <p>The user ${report.reportedUser.id} has been reported</p>
           <p>User : ${report.reporter.fullName} - <b>${report.reporter.email}</b></p>
           <p>Reporter : ${report.reporter.fullName} - <b>${report.reporter.email}</b></p>
           <p>Reason: ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }
}