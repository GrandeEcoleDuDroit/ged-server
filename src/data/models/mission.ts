export interface Mission  {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly schoolLevels: string;
    readonly date: number;
    readonly startDate: number;
    readonly endDate: number;
    readonly duration: string | null;
    readonly maxParticipants: number;
    readonly imageFileName: string | null;
}

export interface MissionTask {
    readonly id: string;
    readonly value: string;
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
    readonly MISSION_SCHOOL_LEVELS: string;
    readonly MISSION_DATE: number;
    readonly MISSION_START_DATE: number;
    readonly MISSION_END_DATE: number;
    readonly MISSION_DURATION: string | null;
    readonly MISSION_MAX_PARTICIPANTS: number;
    readonly MISSION_IMAGE_FILE_NAME: string | null;
}