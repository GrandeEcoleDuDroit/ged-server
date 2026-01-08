import {OracleUser} from "@models/user";

export interface Mission {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly date: number;
    readonly startDate: number;
    readonly endDate: number;
    readonly schoolLevels: string;
    readonly duration: string | null;
    readonly maxParticipants: number;
    readonly imageFileName: string | null;
    readonly test: boolean;
}

export interface MissionTask {
    readonly id: string;
    readonly value: string;
}

export interface MissionManager {
    readonly missionId: string;
    readonly userId: string;
}

export interface MissionParticipant {
    readonly missionId: string;
    readonly userId: string;
}

export interface MissionReport {
    readonly missionId: string;
    readonly reporter: UserInfo;
    readonly reason: string;
}

interface UserInfo {
    readonly fullName: string,
    readonly email: string
}

export interface OracleMission {
    readonly MISSION_ID: string;
    readonly MISSION_TITLE: string;
    readonly MISSION_DESCRIPTION: string;
    readonly MISSION_DATE: number;
    readonly MISSION_START_DATE: number;
    readonly MISSION_END_DATE: number;
    readonly MISSION_SCHOOL_LEVELS: string;
    readonly MISSION_DURATION: string | null;
    readonly MISSION_MAX_PARTICIPANTS: number;
    readonly MISSION_IMAGE_FILE_NAME: string | null;
    readonly MISSION_TEST: number;
}

export interface InboundOracleMission {
    readonly MISSION_ID: string;
    readonly MISSION_TITLE: string;
    readonly MISSION_DESCRIPTION: string;
    readonly MISSION_DATE: number;
    readonly MISSION_START_DATE: number;
    readonly MISSION_END_DATE: number;
    readonly MISSION_SCHOOL_LEVELS: string;
    readonly MISSION_DURATION: string | null;
    readonly MISSION_MANAGERS: OracleUser[];
    readonly MISSION_PARTICIPANTS: OracleUser[];
    readonly MISSION_MAX_PARTICIPANTS: number;
    readonly MISSION_TASKS: InboundOracleMissionTask[];
    readonly MISSION_IMAGE_FILE_NAME: string | null;
}

export interface OracleMissionManager {
    readonly MISSION_ID: string;
    readonly USER_ID: string;
}

export interface OracleMissionParticipant {
    readonly MISSION_ID: string;
    readonly USER_ID: string;
}

export interface OracleMissionTask {
    readonly MISSION_TASK_ID: string;
    readonly MISSION_TASK_VALUE: string;
    readonly MISSION_ID: string;
}

export interface InboundOracleMissionTask {
    readonly MISSION_TASK_ID: string;
    readonly MISSION_TASK_VALUE: string;
}