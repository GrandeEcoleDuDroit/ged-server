import FcmTokenField from '@fields/fcmTokenFields';

export const query = `
    INSERT INTO ${FcmTokenField.TABLE_NAME} (
        ${FcmTokenField.USER_ID},
        ${FcmTokenField.TOKEN}
    )
    SELECT :user_id, :token
    WHERE NOT EXISTS (
        SELECT 1
        FROM ${FcmTokenField.TABLE_NAME}
        WHERE ${FcmTokenField.USER_ID} = :user_id AND ${FcmTokenField.TOKEN} = :token
    );
`;

export const binds = (userId: string, token: string) => ({
    user_id: userId,
    token: token
});