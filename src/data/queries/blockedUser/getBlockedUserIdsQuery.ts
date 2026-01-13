import {BlockedUserField} from '@fields/userField';

export const query = `
    SELECT JSON_OBJECT(*)
    FROM ${BlockedUserField.TABLE_NAME}
    WHERE ${BlockedUserField.USER_ID} = :user_id
`;

export const binds = (userId: string) => ({
    user_id: userId
})