import { MissionField, MissionManagerField, MissionParticipantField, MissionTaskField } from '@fields/missionField';
import UserField from '@fields/userField';

export const getMissionsQuery = `
    SELECT JSON_OBJECT(
        '${MissionField.MISSION_ID}': M.${MissionField.MISSION_ID},
        '${MissionField.MISSION_TITLE}': M.${MissionField.MISSION_TITLE},
        '${MissionField.MISSION_DESCRIPTION}': M.${MissionField.MISSION_DESCRIPTION},
        '${MissionField.MISSION_DATE}': M.${MissionField.MISSION_DATE},
        '${MissionField.MISSION_START_DATE}': M.${MissionField.MISSION_START_DATE},
        '${MissionField.MISSION_END_DATE}': M.${MissionField.MISSION_END_DATE},
        '${MissionField.MISSION_SCHOOL_LEVELS}': M.${MissionField.MISSION_SCHOOL_LEVELS},
        '${MissionField.MISSION_DURATION}': M.${MissionField.MISSION_DURATION},
        '${MissionField.MISSION_MANAGERS}': (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    '${UserField.USER_ID}': ${UserField.USER_ID},
                    '${UserField.USER_FIRST_NAME}': ${UserField.USER_FIRST_NAME},
                    '${UserField.USER_LAST_NAME}': ${UserField.USER_LAST_NAME},
                    '${UserField.USER_EMAIL}': ${UserField.USER_EMAIL},
                    '${UserField.USER_SCHOOL_LEVEL}': ${UserField.USER_SCHOOL_LEVEL},
                    '${UserField.USER_ADMIN}': ${UserField.USER_ADMIN},
                    '${UserField.USER_PROFILE_PICTURE_FILE_NAME}': ${UserField.USER_PROFILE_PICTURE_FILE_NAME},
                    '${UserField.USER_STATE}': ${UserField.USER_STATE},
                    '${UserField.USER_TESTER}': ${UserField.USER_TESTER}
                )
            )
            FROM ${MissionManagerField.TABLE_NAME} MM
            NATURAL JOIN ${UserField.TABLE_NAME}
            WHERE MM.${MissionManagerField.MISSION_ID} = M.${MissionField.MISSION_ID}
       ),
      '${MissionField.MISSION_PARTICIPANTS}': (
          SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                   '${UserField.USER_ID}': ${UserField.USER_ID},
                   '${UserField.USER_FIRST_NAME}': ${UserField.USER_FIRST_NAME},
                   '${UserField.USER_LAST_NAME}': ${UserField.USER_LAST_NAME},
                   '${UserField.USER_EMAIL}': ${UserField.USER_EMAIL},
                   '${UserField.USER_SCHOOL_LEVEL}': ${UserField.USER_SCHOOL_LEVEL},
                   '${UserField.USER_ADMIN}': ${UserField.USER_ADMIN},
                   '${UserField.USER_PROFILE_PICTURE_FILE_NAME}': ${UserField.USER_PROFILE_PICTURE_FILE_NAME},
                   '${UserField.USER_STATE}': ${UserField.USER_STATE},
                   '${UserField.USER_TESTER}': ${UserField.USER_TESTER}
                )
          )
          FROM ${MissionParticipantField.TABLE_NAME} MP
          NATURAL JOIN ${UserField.TABLE_NAME}
          WHERE MP.${MissionParticipantField.MISSION_ID} = M.${MissionField.MISSION_ID}
       ),
       '${MissionField.MISSION_MAX_PARTICIPANTS}': M.MISSION_MAX_PARTICIPANTS, 
       '${MissionField.MISSION_TASKS}': (
          SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    '${MissionTaskField.MISSION_TASK_ID}': ${MissionTaskField.MISSION_TASK_ID},
                    '${MissionTaskField.MISSION_TASK_VALUE}': ${MissionTaskField.MISSION_TASK_VALUE}
                )
          )
          FROM ${MissionTaskField.TABLE_NAME} MT
          WHERE MT.${MissionTaskField.MISSION_ID} = M.${MissionField.MISSION_ID}
       ),
       '${MissionField.MISSION_IMAGE_FILE_NAME}': M.MISSION_IMAGE_FILE_NAME
    ) AS MISSIONS_JSON
    FROM ${MissionField.TABLE_NAME} M
    WHERE M.${MissionField.MISSION_TEST} = :mission_test;
`;

export const getMissionsBinds = (missionTest: boolean) => ({
    mission_test: missionTest ? 1 : 0
});