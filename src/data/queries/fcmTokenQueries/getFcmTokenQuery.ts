import FcmTokenField from '@fields/fcmTokenFields';

export const query = `
    SELECT JSON_OBJECT(*)
    FROM ${FcmTokenField.TABLE_NAME}
    WHERE ${FcmTokenField.USER_ID} = :user_id
`;

export const binds = (userId: string) => ({
    user_id: userId
});