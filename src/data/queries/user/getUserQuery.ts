import {UserField} from "@fields/userField";

export const query = `
    SELECT JSON_OBJECT(*) 
    FROM ${UserField.TABLE_NAME}
    WHERE ${UserField.USER_ID} = :user_id 
      AND ${UserField.USER_TESTER} = :tester
`;

export const binds = (userId: string, tester: number) => ({
    user_id: userId,
    tester: tester
});