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