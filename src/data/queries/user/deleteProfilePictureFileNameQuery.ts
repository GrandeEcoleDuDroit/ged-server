import {UserField} from "@fields/userField";

export const query = `
    UPDATE ${UserField.TABLE_NAME}
    SET ${UserField.USER_PROFILE_PICTURE_FILE_NAME} = NULL
    WHERE ${UserField.USER_ID} = :user_id
`;

export const binds = (userId: string) => ({
    user_id: userId
});