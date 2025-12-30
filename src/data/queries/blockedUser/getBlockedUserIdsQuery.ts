import {BlockedUserField} from '@fields/userField';

export const query = `
    SELECT ${BlockedUserField.BLOCKED_USER_ID} 
    FROM ${BlockedUserField.TABLE_NAME} BU
    WHERE ${BlockedUserField.USER_ID} = :user_id
`;

export const binds = (userId: string) => ({
    user_id: userId
})