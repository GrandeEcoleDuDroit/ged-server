import type {
    Mission,
    MissionManager, MissionParticipant,
    MissionTask,
    OracleMission,
    OracleMissionManager, OracleMissionParticipant,
    OracleMissionTask
} from '@models/mission';

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

export const toMissionManager = (oracleMissionManager: OracleMissionManager): MissionManager => ({
    missionId: oracleMissionManager.MISSION_ID,
    userId: oracleMissionManager.USER_ID
})

export const toMissionParticipant = (oracleMissionParticipant: OracleMissionParticipant): MissionParticipant => ({
    missionId: oracleMissionParticipant.MISSION_ID,
    userId: oracleMissionParticipant.USER_ID
})

export const toMissionTask = (oracleMissionTask: OracleMissionTask): MissionTask => ({
    id: oracleMissionTask.MISSION_TASK_ID,
    value: oracleMissionTask.MISSION_TASK_VALUE
})