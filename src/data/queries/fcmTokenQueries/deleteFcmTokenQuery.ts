import FcmTokenField from '@fields/fcmTokenFields';

export const query = `
    DELETE FROM ${FcmTokenField.TABLE_NAME}
    WHERE ${FcmTokenField.USER_ID} = :user_id
      AND ${FcmTokenField.TOKEN} = :token
`;

export const binds = (userId: string, token: string) => ({
    user_id: userId,
    token: token
});