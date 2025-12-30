import {UserField} from '@fields/userField';

export const query = `
    UPDATE ${UserField.TABLE_NAME}
    SET ${UserField.USER_PROFILE_PICTURE_FILE_NAME} = :user_profile_picture_file_name
    WHERE ${UserField.USER_ID} = :user_id
`;

export const binds = (profilePictureFileName: string, userId: string) => ({
    user_profile_picture_file_name: profilePictureFileName,
    user_id: userId
});