import {BlockedUserField} from "@fields/userField";

export const query = `
    DELETE FROM ${BlockedUserField.TABLE_NAME}
    WHERE ${BlockedUserField.USER_ID} = :user_id
      AND ${BlockedUserField.BLOCKED_USER_ID} = :blocked_user_id
`;

export const binds = (userId: string, blockedUserId: string) => ({
    user_id: userId,
    blocked_user_id: blockedUserId
});