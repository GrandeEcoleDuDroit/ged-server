import {BlockedUserField, UserField} from "@fields/userField";

export const query = `
    SELECT JSON_OBJECT(*) 
    FROM ${BlockedUserField.TABLE_NAME} BU
    WHERE ${BlockedUserField.USER_ID} = :user_id
    INNER JOIN ${UserField.TABLE_NAME} AS U 
    ON U.${UserField.USER_ID} = BU.${BlockedUserField.BLOCKED_USER_ID}
`;

export const binds = (userId: string) => ({
    user_id: userId
})