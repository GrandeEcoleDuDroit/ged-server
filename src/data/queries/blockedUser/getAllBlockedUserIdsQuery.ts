import {BlockedUserField} from '@fields/userField';

export const query = `
    SELECT JSON_OBJECT(
        '${BlockedUserField.USER_ID}': ${BlockedUserField.USER_ID},
        'BLOCKED_USER_IDS': (
            SELECT JSON_ARRAYAGG(${BlockedUserField.BLOCKED_USER_ID})
            FROM ${BlockedUserField.TABLE_NAME} BU
            WHERE BU.${BlockedUserField.USER_ID} = SOURCE.${BlockedUserField.USER_ID}
        )
    ) FROM ${BlockedUserField.TABLE_NAME} SOURCE;
`;