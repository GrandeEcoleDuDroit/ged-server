import type {User, FirestoreUser} from '@models/user';

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