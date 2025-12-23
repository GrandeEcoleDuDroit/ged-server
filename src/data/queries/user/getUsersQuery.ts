import UserField from "@fields/userField";

export const query = `
    SELECT JSON_OBJECT(*) 
    FROM ${UserField.TABLE_NAME}
    WHERE ${UserField.USER_TESTER} = :tester AND
          ${UserField.USER_STATE} = 'active'
`;

export const binds = (tester: number) => ({
    tester: tester
});