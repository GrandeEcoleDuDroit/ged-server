import type {User, FirestoreUser, OracleUser} from '@models/user';

export const toUser = (oracleUser: OracleUser): User => ({
    userId: oracleUser.USER_ID,
    firstName: oracleUser.USER_FIRST_NAME,
    lastName: oracleUser.USER_LAST_NAME,
    email: oracleUser.USER_EMAIL,
    schoolLevel: oracleUser.USER_SCHOOL_LEVEL,
    admin: oracleUser.USER_ADMIN,
    profilePictureFileName: oracleUser.USER_PROFILE_PICTURE_FILE_NAME,
    state: oracleUser.USER_STATE,
    tester: oracleUser.USER_TESTER
})

export const toFirestoreUser = (user: User): FirestoreUser => ({
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    schoolLevel: user.schoolLevel,
    admin: user.admin == 1,
    profilePictureFileName: user.profilePictureFileName,
    state: user.state,
    tester: user.tester == 1
});