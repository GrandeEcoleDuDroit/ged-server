import {BlockedUserField} from '@fields/userField';
import type BlockedUser from "@models/user/blockedUser";

export const query = `
    INSERT INTO ${BlockedUserField.TABLE_NAME} (
        ${BlockedUserField.USER_ID},
        ${BlockedUserField.BLOCKED_USER_ID},
        ${BlockedUserField.BLOCKED_DATE}
    ) VALUES (
        :user_id,
        :blocked_user_id,
        :blocked_date
    )
`;

export const binds = (blockedUser: BlockedUser) => ({
    user_id: blockedUser.USER_ID,
    blocked_user_id: blockedUser.BLOCKED_USER_ID,
    blocked_date: blockedUser.BLOCKED_DATE
});