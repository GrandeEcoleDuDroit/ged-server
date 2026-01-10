import FcmTokenField from '@fields/fcmTokenFields';

export const query = `
    INSERT INTO ${FcmTokenField.TABLE_NAME} (
        ${FcmTokenField.USER_ID},
        ${FcmTokenField.TOKEN}
    ) VALUES (
        :user_id,
        :token
    )
`;

export const binds = (userId: string, token: string) => ({
    user_id: userId,
    token: token
});