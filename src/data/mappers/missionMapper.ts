import type {Mission, OracleMission} from '@models/mission';

export const toMission = (oracleMission: OracleMission): Mission => ({
    id: oracleMission.MISSION_ID,
    title: oracleMission.MISSION_TITLE,
    description: oracleMission.MISSION_DESCRIPTION,
    schoolLevels: oracleMission.MISSION_SCHOOL_LEVELS || '[]',
    date: oracleMission.MISSION_DATE,
    startDate: oracleMission.MISSION_START_DATE,
    endDate: oracleMission.MISSION_END_DATE,
    duration: oracleMission.MISSION_DURATION,
    maxParticipants: oracleMission.MISSION_MAX_PARTICIPANTS,
    imageFileName: oracleMission.MISSION_IMAGE_FILE_NAME,
    test: oracleMission.MISSION_TEST == 1
});