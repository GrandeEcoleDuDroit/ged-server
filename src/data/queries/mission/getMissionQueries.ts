import {MissionField} from "@fields/missionField";

export const getMissionQuery = `
    SELECT JSON_OBJECT(*)
    FROM MISSIONS
    WHERE ${MissionField.MISSION_ID} = :mission_id
`;

export const getMissionBinds = (missionId: string) => ({
    mission_id: missionId}
);