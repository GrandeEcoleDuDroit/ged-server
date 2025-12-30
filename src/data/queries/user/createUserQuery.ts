import {UserField} from '@fields/userField';
import type {User} from '@models/user';

export const query = `
    MERGE INTO ${UserField.TABLE_NAME} U
    USING(SELECT :user_email AS ${UserField.USER_EMAIL} FROM dual) SOURCE
    ON (U.${UserField.USER_EMAIL} = SOURCE.${UserField.USER_EMAIL})
    WHEN MATCHED THEN
        UPDATE SET
            ${UserField.USER_ID} = :user_id,
            ${UserField.USER_FIRST_NAME} = :user_first_name,
            ${UserField.USER_LAST_NAME} = :user_last_name,
            ${UserField.USER_SCHOOL_LEVEL} = :user_school_level,
            ${UserField.USER_STATE} = :user_state
    WHEN NOT MATCHED THEN 
        INSERT (
            ${UserField.USER_ID},
            ${UserField.USER_FIRST_NAME},
            ${UserField.USER_LAST_NAME},
            ${UserField.USER_EMAIL},
            ${UserField.USER_SCHOOL_LEVEL},
            ${UserField.USER_STATE}
        ) VALUES (
            :user_id,
            :user_first_name,
            :user_last_name,
            :user_email,
            :user_school_level,
            :user_state
        )
`;

export const binds = (user: User) => ({
    user_id: user.userId,
    user_first_name: user.firstName,
    user_last_name: user.lastName,
    user_email: user.email,
    user_school_level: user.schoolLevel,
    user_state: user.state
});