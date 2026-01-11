import {UserField} from '@fields/userField';
import type {User} from '@models/user/user';

export const query = `
    UPDATE ${UserField.TABLE_NAME}
    SET ${UserField.USER_FIRST_NAME} = :user_first_name,
        ${UserField.USER_LAST_NAME} = :user_last_name,
        ${UserField.USER_EMAIL} = :user_email,
        ${UserField.USER_SCHOOL_LEVEL} = :user_school_level,
        ${UserField.USER_ADMIN} = :user_admin,
        ${UserField.USER_PROFILE_PICTURE_FILE_NAME} = :user_profile_picture_file_name,
        ${UserField.USER_STATE} = :user_state,
        ${UserField.USER_TESTER} = :user_tester
    WHERE ${UserField.USER_ID} = :user_id
`;

export const binds = (user: User) => ({
    user_first_name: user.firstName,
    user_last_name: user.lastName,
    user_email: user.email,
    user_school_level: user.schoolLevel,
    user_admin: user.admin,
    user_profile_picture_file_name: user.profilePictureFileName,
    user_state: user.state,
    user_tester: user.tester,
    user_id: user.userId
});