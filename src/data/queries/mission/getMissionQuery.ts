import {MissionField} from '@fields/missionField';

export const query = `
    SELECT JSON_OBJECT(*)
    FROM ${MissionField.TABLE_NAME}
    WHERE ${MissionField.MISSION_ID} = :mission_id AND 
          ${MissionField.MISSION_TEST} = :mission_test
`;

export const binds = (missionId: string, missionTest: boolean) => ({
    mission_id: missionId,
    mission_test: missionTest ? 1: 0
});