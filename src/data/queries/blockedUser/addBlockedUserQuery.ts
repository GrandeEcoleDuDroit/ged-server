import {BlockedUserField} from "@fields/userField";

export const query = `
    INSERT INTO ${BlockedUserField.TABLE_NAME} (
        ${BlockedUserField.USER_ID},
        ${BlockedUserField.BLOCKED_USER_ID}
    ) VALUES (
        :user_id,
        :blocked_user_id
    )
`;

export const binds = (userId: string, blockedUserId: string) => ({
    user_id: userId,
    blocked_user_id: blockedUserId
});